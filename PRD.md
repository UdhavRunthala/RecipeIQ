# PRD.md — RecipeIQ

## 1. Problem Statement
People often don't know what to cook with the ingredients they already have at home, leading to food waste, repetitive meals, and unnecessary grocery trips. Separately, tracking daily nutrition manually is tedious enough that most people give up on it. RecipeIQ solves both problems in one place: a pantry-aware recipe assistant with an integrated nutrition tracker.

## 2. Goals
- Let users track what ingredients they have at home, updated as they shop and cook.
- Suggest recipes based on what's actually in the pantry, ranked by ingredient match.
- Let users log meals and see daily calorie/macro totals with minimal manual entry.
- Use an LLM to reduce manual effort: suggesting recipes from pantry contents, and estimating nutrition for meals that aren't saved recipes.

## 3. Target Users
Home cooks who want to reduce food waste and eat with some nutritional awareness, without using a heavyweight meal-planning app. Primary user is also the project's own portfolio use case, so features are scoped to be achievable by a single developer.

## 4. Core Features (In Scope)

### 4.1 Authentication
- Signup and login with email/password.
- Each user has their own pantry, recipes, saved recipes, and nutrition logs.

### 4.2 Pantry Management ("My Pantry")
- Add ingredients with quantity, unit, and storage location (Fridge / Pantry / Freezer).
- Edit quantity (increment/decrement or manual entry).
- Remove items.
- Items can have an expiry date; items expiring soon are flagged with an "expires soon" banner and badge.
- Filter pantry by storage location.

### 4.3 AI Recipe Suggestions ("Cook Today")
- Suggest recipes based on the user's current pantry contents.
- Each suggestion is tagged as "Ready to Cook" (100% of ingredients on hand) or "Missing 1-2 Ingredients" (with the specific missing items named).
- User can view full recipe details (ingredients, step-by-step instructions).
- User can mark a recipe as cooked, which deducts the used ingredients from their pantry automatically.
- User can save a suggested recipe for later.

### 4.4 Nutrition Tracking ("Meal Log")
- Log meals under Breakfast / Lunch / Dinner / Snack.
- A logged meal can come from a saved recipe (nutrition pulled from the recipe) or be entered as free text (nutrition estimated by the LLM).
- Daily summary: total calories and protein vs. a daily goal, shown as progress bars.
- Edit or delete individual log entries.

### 4.5 Saved Recipes
- Users can bookmark recipes (AI-suggested or otherwise) for later use, independent of current pantry match.

## 5. Out of Scope (for now)
- Grocery list generation / shopping integrations.
- Social features (sharing recipes between users, following other users).
- Mobile app (web-responsive only).
- Barcode scanning or receipt-based pantry updates (all pantry updates are manual).
- Multiple dietary profiles per user (allergies, restrictions) — may be a future addition.

## 6. Success Criteria
- A user can go from "empty pantry" to "get a relevant recipe suggestion" in under 2 minutes.
- Recipe suggestions meaningfully reflect pantry contents (not generic/random).
- Nutrition totals update correctly and immediately after logging a meal.
- All core flows (signup, add pantry item, get suggestion, cook a recipe, log a meal) work end-to-end without manual DB intervention.

## 7. Key User Stories
1. As a user, I want to add what's in my fridge so the app knows what I have.
2. As a user, I want recipe suggestions based on my pantry so I don't waste ingredients.
3. As a user, I want to see exactly which ingredients I'm missing for a recipe so I can decide whether to shop or pick a different one.
4. As a user, I want my pantry to update automatically when I cook something, so I don't have to manually subtract ingredients.
5. As a user, I want to log a quick meal description and get an estimated nutrition breakdown without looking anything up myself.
6. As a user, I want to see my daily calorie/protein progress at a glance.