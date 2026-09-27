const {
  getPantryItemsForUser,
  findOrCreateIngredient,
  addPantryItem,
  updatePantryItemQuantity,
  deletePantryItem,
} = require("../models/pantryItem.model");
const asyncHandler = require("../utils/asyncHandler");

const getPantry = asyncHandler(async (req, res) => {
  const items = await getPantryItemsForUser(req.user.id);
  res.status(200).json(items);
});

const createPantryItem = asyncHandler(async (req, res) => {
  const { name, category, quantity, unit, location, expiresAt } = req.body;

  if (!name || quantity === undefined) {
    return res.status(400).json({ error: "Ingredient name and quantity are required." });
  }

  const ingredient = await findOrCreateIngredient({ name, category, defaultUnit: unit });
  const item = await addPantryItem({
    userId: req.user.id,
    ingredientId: ingredient.id,
    quantity,
    unit,
    location: location || "Pantry",
    expiresAt: expiresAt || null,
  });

  res.status(201).json(item);
});

const updatePantryItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  if (quantity === undefined) {
    return res.status(400).json({ error: "Quantity is required." });
  }

  const updated = await updatePantryItemQuantity({ id, userId: req.user.id, quantity });

  if (!updated) {
    return res.status(404).json({ error: "Pantry item not found." });
  }

  res.status(200).json(updated);
});

const removePantryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deletePantryItem({ id, userId: req.user.id });

  if (!deleted) {
    return res.status(404).json({ error: "Pantry item not found." });
  }

  res.status(204).send();
});

module.exports = { getPantry, createPantryItem, updatePantryItem, removePantryItem };