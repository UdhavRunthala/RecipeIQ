// ============================================
// JavaScript — Hoisting
// Run with: node concepts/hoisting.demo.js
// ============================================

// 1. var is hoisted AND initialized as undefined
console.log("1. var before declaration:", pantryCount); // undefined, not an error
var pantryCount = 12;
console.log("   var after declaration:", pantryCount);

// 2. let/const are hoisted but NOT initialized — accessing them early throws
try {
  console.log(recipeTitle);
} catch (err) {
  console.log("2. let before declaration throws:", err.message);
}
let recipeTitle = "Crispy Skillet Salmon";

// 3. Function DECLARATIONS are fully hoisted — usable before their definition
console.log("3. calling function before its definition works:");
console.log("   ", getPantryStatus());

function getPantryStatus() {
  return "Pantry has items";
}

// 4. Function EXPRESSIONS are NOT hoisted the same way — only the variable is hoisted
try {
  checkExpiry();
} catch (err) {
  console.log("4. calling a function expression before assignment throws:", err.message);
}
const checkExpiry = function () {
  return "Checking expiry dates...";
};

// ---- Where this matters in RecipeIQ ----
// In our controllers (e.g. pantry.controller.js), we always write
// `const getPantry = asyncHandler(async (req, res) => {...})`
// as a function EXPRESSION, not a declaration. That's a deliberate choice —
// declaring controllers this way means they can't be accidentally called
// before they're fully defined, since hoisting won't save us here.