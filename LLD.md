# LLD.md — RecipeIQ

## 1. Database Schema

### users
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### ingredients
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| category | VARCHAR(50) | |
| default_unit | VARCHAR(20) | |

### pantry_items
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id), ON DELETE CASCADE |
| ingredient_id | INTEGER | FK → ingredients(id), ON DELETE CASCADE |
| quantity | NUMERIC(10,2) | NOT NULL, DEFAULT 0 |
| unit | VARCHAR(20) | |
| location | VARCHAR(20) | DEFAULT 'Pantry' |
| expires_at | DATE | nullable |
| last_updated | TIMESTAMP | DEFAULT NOW() |
| — | — | UNIQUE(user_id, ingredient_id) |

### recipes
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| created_by | INTEGER | FK → users(id), ON DELETE SET NULL, nullable |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | |
| time_minutes | INTEGER | |
| tag | VARCHAR(50) | |
| calories | INTEGER | |
| protein / carbs / fats | NUMERIC(6,2) | |
| instructions | JSONB | array of `{ title, content, tip }` |
| is_ai_generated | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT NOW() |

### recipe_ingredients (many-to-many: recipes ↔ ingredients)
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| recipe_id | INTEGER | FK → recipes(id), ON DELETE CASCADE |
| ingredient_id | INTEGER | FK → ingredients(id), ON DELETE CASCADE |
| quantity_needed | VARCHAR(50) | display string, e.g. "200g" |
| — | — | UNIQUE(recipe_id, ingredient_id) |

### saved_recipes (many-to-many: users ↔ recipes)
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id), ON DELETE CASCADE |
| recipe_id | INTEGER | FK → recipes(id), ON DELETE CASCADE |
| saved_at | TIMESTAMP | DEFAULT NOW() |
| — | — | UNIQUE(user_id, recipe_id) |

### nutrition_logs
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id), ON DELETE CASCADE |
| recipe_id | INTEGER | FK → recipes(id), ON DELETE SET NULL, nullable |
| meal_type | VARCHAR(20) | 'BREAKFAST' \| 'LUNCH' \| 'DINNER' \| 'SNACK' |
| food_name | VARCHAR(150) | NOT NULL |
| calories | INTEGER | |
| protein / carbs / fats | NUMERIC(6,2) | |
| logged_at | TIMESTAMP | DEFAULT NOW() |

Indexes: `pantry_items(user_id)`, `nutrition_logs(user_id, logged_at)`, `recipe_ingredients(recipe_id)`.

## 2. API Endpoints

### Auth
| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| POST | /api/auth/signup | No | `{ name, email, password }` | 201 `{ user, token }` |
| POST | /api/auth/login | No | `{ email, password }` | 200 `{ user, token }` |

### Pantry
| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| GET | /api/pantry | Yes | — | 200 `[pantryItem]` |
| POST | /api/pantry | Yes | `{ name, category, quantity, unit, location, expiresAt }` | 201 `pantryItem` |
| PATCH | /api/pantry/:id | Yes | `{ quantity }` | 200 `pantryItem` |
| DELETE | /api/pantry/:id | Yes | — | 204 |

### Recipes
| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| GET | /api/recipes | Yes | — | 200 `[recipe]` |
| GET | /api/recipes/:id | Yes | — | 200 `recipe` (with ingredients + instructions) |
| POST | /api/recipes | Yes | `{ title, description, ingredients[], instructions[], ... }` | 201 `recipe` |
| POST | /api/recipes/:id/cook | Yes | — | 200 `{ updatedPantry }` — deducts ingredients |
| POST | /api/recipes/:id/save | Yes | — | 201 (adds to `saved_recipes`) |
| GET | /api/recipes/saved | Yes | — | 200 `[recipe]` |

### Nutrition
| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| GET | /api/nutrition?date=YYYY-MM-DD | Yes | — | 200 `{ logs[], totals }` |
| POST | /api/nutrition | Yes | `{ mealType, recipeId? , foodName? }` | 201 `nutritionLog` |
| DELETE | /api/nutrition/:id | Yes | — | 204 |

### AI
| Method | Path | Auth? | Body | Response |
|---|---|---|---|---|
| GET | /api/ai/suggest-recipes | Yes | — | 200 `[suggestion]` (not yet persisted) |
| POST | /api/ai/estimate-nutrition | Yes | `{ description }` | 200 `{ calories, protein, carbs, fats }` |

### HTTP status code conventions used throughout
- `200` — successful read/update
- `201` — resource created
- `204` — successful delete, no content returned
- `400` — malformed request (missing required fields)
- `401` — missing/invalid/expired token
- `403` — authenticated but not authorized for this resource (e.g. editing another user's pantry item)
- `404` — resource not found (or not found *for this user*, to avoid leaking existence of other users' data)
- `409` — conflict (e.g. signup with an email that already exists)
- `500` — unhandled server error

## 3. Component Breakdown (Frontend)

App

Layout (Sidebar, Topbar)
PantryPage
AddItemForm / Add Ingredient modal
PantryCard (per item)
CookTodayPage
RecipeCard (per suggestion)
RecipeDetailPage
Ingredient list (with pantry deduction preview)
Instructions (step list)
MealLogPage
Daily summary (calories/protein progress)
MealEntryRow (per logged meal)
SavedRecipesPage
RecipeCard (reused)


State approach: page-level `useState` for now (as currently implemented with mock data), with API calls replacing mock data sources one page at a time. No global state library is needed yet at this scale — if the app grows (e.g. pantry data needed across multiple pages simultaneously), a `PantryContext` can be introduced.

## 4. Key Algorithms / Logic Details

### 4.1 Recipe suggestion ranking
The OpenAI prompt includes the full pantry list (ingredient name + quantity + unit). The model is instructed to return recipes ordered by number of missing ingredients (ascending), and to explicitly list which pantry ingredients are used and which additional ones are required. The server does not do its own ranking — this responsibility is delegated to the prompt design, since flexible ingredient substitution/matching (e.g. "onion" satisfying "yellow onion") is better handled by the LLM's language understanding than by strict SQL matching.

### 4.2 Ingredient matching for pantry deduction ("cook this recipe")
This is stricter than suggestion matching: deduction only happens for ingredients where `recipe_ingredients.ingredient_id` has an exact matching row in the user's `pantry_items`. If quantities in the recipe exceed what's in the pantry, the deduction floors at zero rather than going negative, and the response notes which ingredients ran short — it does not block the "cook" action entirely.

### 4.3 Nutrition estimation from free text
The `/api/ai/estimate-nutrition` prompt instructs the model to return only a JSON object with `calories`, `protein`, `carbs`, `fats` (numbers only, no units in the values). The server validates that all four keys are present and numeric before saving; if validation fails, it returns a 502-style error to the client rather than saving corrupted data.

## 5. Error Handling Pattern
Every controller function is wrapped in `asyncHandler`, which forwards thrown errors to a single Express error-handling middleware. Errors thrown with a `statusCode` property (e.g. `throw Object.assign(new Error("Not found"), { statusCode: 404 })`) are respected; anything unhandled defaults to `500`. This keeps status-code logic centralized and consistent rather than scattered per-route.