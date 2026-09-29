const pool = require("../config/db");

async function createNutritionLog({ userId, recipeId, mealType, foodName, calories, protein, carbs, fats }) {
  const result = await pool.query(
    `INSERT INTO nutrition_logs (user_id, recipe_id, meal_type, food_name, calories, protein, carbs, fats)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, recipeId || null, mealType, foodName, calories, protein, carbs, fats]
  );
  return result.rows[0];
}

async function getLogsForDate({ userId, date }) {
  const result = await pool.query(
    `SELECT * FROM nutrition_logs
     WHERE user_id = $1 AND DATE(logged_at) = $2
     ORDER BY logged_at ASC`,
    [userId, date]
  );
  return result.rows;
}

async function deleteNutritionLog({ id, userId }) {
  const result = await pool.query(
    `DELETE FROM nutrition_logs WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

module.exports = { createNutritionLog, getLogsForDate, deleteNutritionLog };