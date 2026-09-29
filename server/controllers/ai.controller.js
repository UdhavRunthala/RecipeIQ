const { getPantryItemsForUser } = require("../models/pantryItem.model");
const { getRecentRecipesForUser } = require("../models/recipe.model");
const { getRecipeSuggestions } = require("../services/llm.service");
const asyncHandler = require("../utils/asyncHandler");

const suggestRecipes = asyncHandler(async (req, res) => {
  // EVENT LOOP: these two DB queries are independent of each other, so we
  // run them concurrently with Promise.all instead of awaiting them one
  // after another. Sequential awaits (await A(); await B();) would leave
  // the event loop idle waiting on the first query before even starting
  // the second, even though nothing requires that order. Node is
  // single-threaded for JS execution, but I/O (the DB round-trip here) is
  // handled outside that thread — so kicking off both at once lets them
  // overlap, and the total wait time becomes max(A, B) instead of A + B.
  const [pantryItems, recentRecipes] = await Promise.all([
    getPantryItemsForUser(req.user.id),
    getRecentRecipesForUser(req.user.id),
  ]);

  const suggestions = await getRecipeSuggestions({ pantryItems, recentRecipes });

  res.status(200).json(suggestions);
});

module.exports = { suggestRecipes };