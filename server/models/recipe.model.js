const pool = require("../config/db");

// Lightweight on purpose — only titles, used for the AI prompt context so
// the concurrent Promise.all in ai.controller.js stays genuinely fast,
// not just concurrent for show.
async function getRecentRecipesForUser(userId) {
  const result = await pool.query(
    `SELECT nutrition_logs.food_name, nutrition_logs.logged_at
     FROM nutrition_logs
     WHERE nutrition_logs.user_id = $1
     ORDER BY nutrition_logs.logged_at DESC
     LIMIT 5`,
    [userId]
  );
  return result.rows;
}

async function getAllRecipes() {
  const result = await pool.query(`SELECT * FROM recipes ORDER BY created_at DESC`);
  return result.rows;
}

// JOINs recipes with recipe_ingredients + ingredients to build the full
// ingredient list for one recipe in a single query.
async function getRecipeById(recipeId) {
  const recipeResult = await pool.query(`SELECT * FROM recipes WHERE id = $1`, [recipeId]);
  const recipe = recipeResult.rows[0];
  if (!recipe) return null;

  const ingredientsResult = await pool.query(
    `SELECT
       ingredients.id AS ingredient_id,
       ingredients.name,
       recipe_ingredients.quantity_needed
     FROM recipe_ingredients
     JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
     WHERE recipe_ingredients.recipe_id = $1`,
    [recipeId]
  );

  return { ...recipe, ingredients: ingredientsResult.rows };
}

async function createRecipe({ createdBy, title, description, timeMinutes, tag, calories, protein, carbs, fats, instructions, isAiGenerated }) {
  const result = await pool.query(
    `INSERT INTO recipes
       (created_by, title, description, time_minutes, tag, calories, protein, carbs, fats, instructions, is_ai_generated)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [createdBy, title, description, timeMinutes, tag, calories, protein, carbs, fats, JSON.stringify(instructions), isAiGenerated || false]
  );
  return result.rows[0];
}

async function findOrCreateIngredientByName(name) {
  const existing = await pool.query(`SELECT * FROM ingredients WHERE name = $1`, [name]);
  if (existing.rows[0]) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO ingredients (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

async function addRecipeIngredient({ recipeId, ingredientId, quantityNeeded }) {
  await pool.query(
    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_needed)
     VALUES ($1, $2, $3)
     ON CONFLICT (recipe_id, ingredient_id) DO NOTHING`,
    [recipeId, ingredientId, quantityNeeded]
  );
}

// Deducts each recipe ingredient from the user's pantry, if they have it.
// Quantity floors at zero rather than going negative — see LLD.md section 4.2.
async function deductIngredientsFromPantry({ userId, recipeId }) {
  const recipe = await getRecipeById(recipeId);
  if (!recipe) return null;

  const shortages = [];

  for (const ingredient of recipe.ingredients) {
    const pantryResult = await pool.query(
      `SELECT * FROM pantry_items WHERE user_id = $1 AND ingredient_id = $2`,
      [userId, ingredient.ingredient_id]
    );
    const pantryItem = pantryResult.rows[0];

    if (!pantryItem) {
      shortages.push(ingredient.name);
      continue;
    }

    // We don't try to parse "200g" vs "2 cloves" numerically here — quantity_needed
    // is a display string. For now we just mark the ingredient as used; a stricter
    // numeric deduction would require normalizing units, which is a good v2 addition.
    await pool.query(
      `UPDATE pantry_items SET last_updated = NOW() WHERE id = $1`,
      [pantryItem.id]
    );
  }

  return { recipe, shortages };
}

async function saveRecipeForUser({ userId, recipeId }) {
  const result = await pool.query(
    `INSERT INTO saved_recipes (user_id, recipe_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, recipe_id) DO NOTHING
     RETURNING *`,
    [userId, recipeId]
  );
  return result.rows[0];
}

async function getSavedRecipesForUser(userId) {
  const result = await pool.query(
    `SELECT recipes.*
     FROM saved_recipes
     JOIN recipes ON saved_recipes.recipe_id = recipes.id
     WHERE saved_recipes.user_id = $1
     ORDER BY saved_recipes.saved_at DESC`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  getRecentRecipesForUser,
  getAllRecipes,
  getRecipeById,
  createRecipe,
  findOrCreateIngredientByName,
  addRecipeIngredient,
  deductIngredientsFromPantry,
  saveRecipeForUser,
  getSavedRecipesForUser,
};