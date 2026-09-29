const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Asks the model for recipe ideas based on the user's pantry, and requires
// strict JSON back so we can safely parse it — LLM output is never trusted
// as-is, since a malformed response should never reach the client or the DB.
async function getRecipeSuggestions({ pantryItems, recentRecipes }) {
  const pantryList = pantryItems
    .map((item) => `${item.quantity} ${item.unit} ${item.name}`)
    .join(", ");

  const recentList = recentRecipes.map((r) => r.food_name).join(", ") || "none";

  const prompt = `
You are a recipe suggestion engine. The user's current pantry contains: ${pantryList}.
Their recently eaten meals (avoid repeating these too closely): ${recentList}.

Suggest 4 recipes ordered by fewest missing ingredients first.
Respond with ONLY a JSON array, no other text, in this exact shape:
[
  {
    "title": string,
    "description": string,
    "timeMinutes": number,
    "tag": string,
    "usedIngredients": string[],
    "missingIngredients": string[],
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number
  }
]
  `.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices[0].message.content;

  let suggestions;
  try {
    suggestions = JSON.parse(raw);
  } catch (err) {
    const error = new Error("AI response could not be parsed. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  if (!Array.isArray(suggestions)) {
    const error = new Error("AI response was not in the expected format.");
    error.statusCode = 502;
    throw error;
  }

  return suggestions;
}

// Estimates nutrition for a free-text meal description.
async function estimateNutritionFromText(description) {
  const prompt = `
Estimate the nutrition for this meal: "${description}".
Respond with ONLY a JSON object, no other text, in this exact shape:
{ "calories": number, "protein": number, "carbs": number, "fats": number }
  `.trim();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const raw = response.choices[0].message.content;

  let estimate;
  try {
    estimate = JSON.parse(raw);
  } catch (err) {
    const error = new Error("AI response could not be parsed. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  const requiredKeys = ["calories", "protein", "carbs", "fats"];
  const isValid = requiredKeys.every((key) => typeof estimate[key] === "number");

  if (!isValid) {
    const error = new Error("AI response was missing expected nutrition fields.");
    error.statusCode = 502;
    throw error;
  }

  return estimate;
}

module.exports = { getRecipeSuggestions, estimateNutritionFromText };