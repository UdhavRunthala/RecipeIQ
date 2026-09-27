const pool = require("../config/db");

// JOIN pantry_items with ingredients to get the ingredient name/category in one query
async function getPantryItemsForUser(userId) {
  const result = await pool.query(
    `SELECT
       pantry_items.id,
       pantry_items.quantity,
       pantry_items.unit,
       pantry_items.location,
       pantry_items.expires_at,
       ingredients.name,
       ingredients.category
     FROM pantry_items
     JOIN ingredients ON pantry_items.ingredient_id = ingredients.id
     WHERE pantry_items.user_id = $1
     ORDER BY pantry_items.last_updated DESC`,
    [userId]
  );
  return result.rows;
}

async function findOrCreateIngredient({ name, category, defaultUnit }) {
  const existing = await pool.query(`SELECT * FROM ingredients WHERE name = $1`, [name]);
  if (existing.rows[0]) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO ingredients (name, category, default_unit) VALUES ($1, $2, $3) RETURNING *`,
    [name, category, defaultUnit]
  );
  return result.rows[0];
}

async function addPantryItem({ userId, ingredientId, quantity, unit, location, expiresAt }) {
  const result = await pool.query(
    `INSERT INTO pantry_items (user_id, ingredient_id, quantity, unit, location, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, ingredient_id)
     DO UPDATE SET quantity = pantry_items.quantity + EXCLUDED.quantity, last_updated = NOW()
     RETURNING *`,
    [userId, ingredientId, quantity, unit, location, expiresAt]
  );
  return result.rows[0];
}

async function updatePantryItemQuantity({ id, userId, quantity }) {
  const result = await pool.query(
    `UPDATE pantry_items
     SET quantity = $1, last_updated = NOW()
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [quantity, id, userId]
  );
  return result.rows[0];
}

async function deletePantryItem({ id, userId }) {
  const result = await pool.query(
    `DELETE FROM pantry_items WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
}

module.exports = {
  getPantryItemsForUser,
  findOrCreateIngredient,
  addPantryItem,
  updatePantryItemQuantity,
  deletePantryItem,
};