import { ArrowLeft, Clock, Flame, CheckCircle2, Bookmark } from "lucide-react";
import { mockRecipes } from "../data/mockRecipes";

export default function RecipeDetailPage({ recipeId, onBack }) {
  const recipe = mockRecipes.find((r) => r.id === recipeId);

  if (!recipe) return <p className="text-gray-400">Recipe not found.</p>;

  const hasDetails = recipe.ingredients && recipe.instructions;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={14} />
        Back to Recipes
      </button>

      {!hasDetails ? (
        <p className="text-gray-400">Full instructions for this recipe aren't written yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 pb-24">
          {/* Left column */}
          <div>
            <div className="h-48 bg-gradient-to-br from-emerald-100 to-orange-100 rounded-xl flex items-center justify-center text-4xl mb-4">
              🍽️
            </div>

            <h1 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <Flame size={14} />
                {recipe.calories} kcal
              </span>
            </div>

            <p className="text-xs font-medium text-gray-400 tracking-wide uppercase mb-3">
              Pantry Deductions
            </p>
            <p className="text-xs text-gray-400 mb-3">
              These ingredients will be subtracted from your inventory once cooked.
            </p>

            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm">
                <span className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {ing.name}
                </span>
                <span className="text-gray-400">{ing.quantity}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div>
            <p className="text-xs font-medium text-gray-400 tracking-wide uppercase mb-1">
              Step-by-Step Culinary Guide
            </p>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Cooking Instructions</h2>

            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-white text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">{step.title}</p>
                  <p className="text-sm text-gray-500 mb-2">{step.content}</p>
                  {step.tip && (
                    <div className="bg-emerald-50 text-emerald-700 text-xs rounded-lg px-3 py-2">
                      💡 {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Ready to finish? Deducts tracked items automatically.</p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg">
            <Bookmark size={14} />
            Save for Later
          </button>
          <button className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2 rounded-lg">
            Cooked This! Deduct from Pantry
          </button>
        </div>
      </div>
    </div>
  );
}