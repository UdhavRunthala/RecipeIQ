const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const {
  listRecipes,
  getRecipe,
  addRecipe,
  cookRecipe,
  saveRecipe,
  listSavedRecipes,
} = require("../controllers/recipes.controller");

router.use(requireAuth);

router.get("/saved", listSavedRecipes); // must come before "/:id" or "saved" gets treated as an id
router.get("/", listRecipes);
router.get("/:id", getRecipe);
router.post("/", addRecipe);
router.post("/:id/cook", cookRecipe);
router.post("/:id/save", saveRecipe);

module.exports = router;