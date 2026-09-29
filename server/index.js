const express = require("express");
const cors = require("cors");
require("dotenv").config();

// HOISTING: these are all `const`, not `var`. With `var`, each of these
// names would be hoisted to the top of the file AND initialized to
// `undefined` immediately — meaning a bug like accidentally calling
// `app.use("/api/pantry", pantryRoutes)` ABOVE this line would silently
// pass `undefined` as the router instead of throwing an error, and Express
// would fail confusingly at request time instead of at startup.
// `const` is hoisted too, but left in a "temporal dead zone" — accessing it
// before its declaration throws immediately, which surfaces ordering bugs
// like that the moment the file loads, not later during a request.

const errorHandler = require("./middleware/errorHandler.middleware");
const authRoutes = require("./routes/auth.routes");
const pantryRoutes = require("./routes/pantry.routes");
const recipesRoutes = require("./routes/recipes.routes");
const nutritionRoutes = require("./routes/nutrition.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RecipeIQ API is running." });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});