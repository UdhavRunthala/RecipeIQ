# HLD.md — RecipeIQ

## 1. Architecture Overview

RecipeIQ is a three-tier PERN application with an external LLM API for AI features.

React Client (Vite, Tailwind) <--HTTPS/JSON--> Express API (Node.js)
|
-----------------------------------
| |
PostgreSQL (Neon) OpenAI API
- users - recipe suggestions
- pantry_items - nutrition estimates
- recipes
- nutrition_logs

## 2. System Components

### 2.1 Client (React + Vite + Tailwind)
- Single-page application.
- Pages: Pantry, Cook Today, Meal Log, Saved Recipes, Recipe Detail, Login/Signup.
- Communicates with the backend exclusively via REST endpoints under `/api/*`.
- Stores the JWT auth token (in memory or localStorage) and attaches it as a Bearer token on every authenticated request.

### 2.2 Server (Express + Node.js)
- Stateless REST API. No server-side sessions — auth state lives entirely in the JWT.
- Organized in layers: `routes` → `controllers` → `models` (raw SQL via `pg`), plus a `services` layer for the OpenAI integration.
- Middleware handles auth verification and centralized error handling.

### 2.3 Database (PostgreSQL, hosted on Neon)
- Relational schema with foreign keys enforcing user ownership of pantry items, recipes, and logs.
- Two many-to-many relationships: `recipe_ingredients` (recipes ↔ ingredients) and `saved_recipes` (users ↔ recipes).
- See LLD.md for full table definitions.

### 2.4 LLM Integration (OpenAI API)
- Called server-side only — the API key never reaches the client.
- Two distinct use cases:
  1. **Recipe suggestion**: given a user's pantry contents, request a ranked list of recipe ideas with ingredient match info.
  2. **Nutrition estimation**: given a free-text meal description, request a structured calorie/macro estimate.
- Both use cases prompt the model to return strict JSON, which the server parses and validates before sending to the client or writing to the database.

## 3. Key Data Flows

### 3.1 Recipe Suggestion Flow
1. Client requests `GET /api/ai/suggest-recipes`.
2. Server fetches the user's current pantry contents from Postgres.
3. Server builds a prompt listing available ingredients and sends it to the OpenAI API.
4. OpenAI returns suggestions as structured JSON (title, description, ingredients used, ingredients missing, estimated macros).
5. Server returns this to the client; if the user chooses to save a suggestion, a new row is written to `recipes` (and its ingredients to `recipe_ingredients`).

### 3.2 "Cook This Recipe" Flow
1. Client sends `POST /api/recipes/:id/cook`.
2. Server looks up the recipe's ingredients via a JOIN on `recipe_ingredients`.
3. For each ingredient the user has in their pantry, the server deducts the needed quantity from `pantry_items` (a multi-row update, ideally wrapped in a database transaction so a partial failure doesn't leave the pantry in an inconsistent state).
4. Server responds with the updated pantry state.

### 3.3 Nutrition Logging Flow
- **From a saved recipe**: client sends the recipe ID; server copies calories/macros from the `recipes` row into a new `nutrition_logs` row.
- **Ad-hoc meal**: client sends free text; server calls the OpenAI API for an estimate, then writes the estimated values into `nutrition_logs`.

## 4. Authentication & Security
- Passwords hashed with bcrypt before storage; plaintext passwords are never persisted or logged.
- JWT issued on login/signup, expires after 7 days.
- All resource routes (pantry, recipes, nutrition, saved recipes) are protected by auth middleware that verifies the JWT and scopes every query to `req.user.id`, so one user can never read or modify another user's data.
- OpenAI API key stored only in server-side environment variables.

## 5. Tech Stack Summary
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, lucide-react |
| Backend | Node.js, Express |
| Database | PostgreSQL (hosted on Neon) |
| Data access | Raw SQL via the `pg` library (no ORM) |
| Auth | JWT + bcrypt |
| AI | OpenAI API |

## 6. Non-Functional Considerations
- **Data isolation**: every query in a protected route filters by `user_id` — enforced at the query level, not just the UI.
- **Error handling**: all async route handlers are wrapped to funnel errors into a single centralized error-handling middleware, ensuring consistent JSON error responses and HTTP status codes.
- **LLM output validation**: since LLM responses are inherently variable, the server validates the shape of the returned JSON before trusting it (falls back to an error response if parsing fails, rather than passing malformed data to the client or database).