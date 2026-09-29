const { createNutritionLog, getLogsForDate, deleteNutritionLog } = require("../models/nutritionLog.model");
const { getRecipeById } = require("../models/recipe.model");
const { estimateNutritionFromText } = require("../services/llm.service");
const asyncHandler = require("../utils/asyncHandler");

const getDailyLog = asyncHandler(async (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];
  const logs = await getLogsForDate({ userId: req.user.id, date });

  const totals = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + Number(log.protein || 0),
      carbs: acc.carbs + Number(log.carbs || 0),
      fats: acc.fats + Number(log.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  res.status(200).json({ logs, totals });
});

const logMeal = asyncHandler(async (req, res) => {
  const { mealType, recipeId, foodName } = req.body;

  if (!mealType) {
    return res.status(400).json({ error: "mealType is required." });
  }

  let nutritionValues;
  let resolvedFoodName = foodName;

  if (recipeId) {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }
    nutritionValues = {
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fats: recipe.fats,
    };
    resolvedFoodName = recipe.title;
  } else if (foodName) {
    nutritionValues = await estimateNutritionFromText(foodName);
  } else {
    return res.status(400).json({ error: "Either recipeId or foodName is required." });
  }

  const log = await createNutritionLog({
    userId: req.user.id,
    recipeId: recipeId || null,
    mealType,
    foodName: resolvedFoodName,
    ...nutritionValues,
  });

  res.status(201).json(log);
});

const removeLog = asyncHandler(async (req, res) => {
  const deleted = await deleteNutritionLog({ id: req.params.id, userId: req.user.id });
  if (!deleted) {
    return res.status(404).json({ error: "Log entry not found." });
  }
  res.status(204).send();
});

module.exports = { getDailyLog, logMeal, removeLog };