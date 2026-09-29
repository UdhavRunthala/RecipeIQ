const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  findOrCreateIngredientByName,
  addRecipeIngredient,
  deductIngredientsFromPantry,
  saveRecipeForUser,
  getSavedRecipesForUser,
} = require("../models/recipe.model");
const asyncHandler = require("../utils/asyncHandler");

const listRecipes = asyncHandler(async (req, res) => {
  const recipes = await getAllRecipes();
  res.status(200).json(recipes);
});

const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await getRecipeById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found." });
  }
  res.status(200).json(recipe);
});

const addRecipe = asyncHandler(async (req, res) => {
  const { title, description, timeMinutes, tag, calories, protein, carbs, fats, instructions, ingredients } = req.body;

  if (!title || !ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Title and an ingredients array are required." });
  }

  const recipe = await createRecipe({
    createdBy: req.user.id,
    title,
    description,
    timeMinutes,
    tag,
    calories,
    protein,
    carbs,
    fats,
    instructions,
  });

  for (const ing of ingredients) {
    const ingredient = await findOrCreateIngredientByName(ing.name);
    await addRecipeIngredient({
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      quantityNeeded: ing.quantity,
    });
  }

  res.status(201).json(recipe);
});

const cookRecipe = asyncHandler(async (req, res) => {
  const result = await deductIngredientsFromPantry({
    userId: req.user.id,
    recipeId: req.params.id,
  });

  if (!result) {
    return res.status(404).json({ error: "Recipe not found." });
  }

  res.status(200).json({
    message: "Recipe cooked — pantry updated.",
    shortages: result.shortages,
  });
});

const saveRecipe = asyncHandler(async (req, res) => {
  const saved = await saveRecipeForUser({ userId: req.user.id, recipeId: req.params.id });
  res.status(201).json(saved);
});

const listSavedRecipes = asyncHandler(async (req, res) => {
  const recipes = await getSavedRecipesForUser(req.user.id);
  res.status(200).json(recipes);
});

module.exports = { listRecipes, getRecipe, addRecipe, cookRecipe, saveRecipe, listSavedRecipes };