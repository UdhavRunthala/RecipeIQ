const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const {
  getPantry,
  createPantryItem,
  updatePantryItem,
  removePantryItem,
} = require("../controllers/pantry.controller");

router.use(requireAuth); // every route below requires a valid token

router.get("/", getPantry);
router.post("/", createPantryItem);
router.patch("/:id", updatePantryItem);
router.delete("/:id", removePantryItem);

module.exports = router;