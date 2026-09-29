const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const { suggestRecipes } = require("../controllers/ai.controller");
const { estimateNutritionFromText } = require("../services/llm.service");
const asyncHandler = require("../utils/asyncHandler");

router.use(requireAuth);

router.get("/suggest-recipes", suggestRecipes);

router.post(
  "/estimate-nutrition",
  asyncHandler(async (req, res) => {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "description is required." });
    }
    const estimate = await estimateNutritionFromText(description);
    res.status(200).json(estimate);
  })
);

module.exports = router;