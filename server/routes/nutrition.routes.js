const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const { getDailyLog, logMeal, removeLog } = require("../controllers/nutrition.controller");

router.use(requireAuth);

router.get("/", getDailyLog);
router.post("/", logMeal);
router.delete("/:id", removeLog);

module.exports = router;