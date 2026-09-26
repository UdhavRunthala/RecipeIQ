import { mockRecipes } from "../data/mockRecipes";
import RecipeCard from "../components/cooktoday/RecipeCard";

export default function CookTodayPage({ onViewRecipe }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">What to Cook Today</h1>
          <p className="text-sm text-gray-400">Recipes matched to your available pantry ingredients</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Ready to Cook (100% on hand)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            Missing 1-2 Ingredients
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onView={onViewRecipe} />
        ))}
      </div>
    </div>
  );
}