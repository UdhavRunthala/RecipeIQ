import { Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function RecipeCard({ recipe, onView }) {
  const isReady = recipe.status === "ready";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-emerald-100 to-orange-100 flex items-center justify-center text-3xl">
        🍽️
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          {isReady ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={12} />
              All ingredients on hand
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              <AlertCircle size={12} />
              Missing: {recipe.missingItems.length} item{recipe.missingItems.length > 1 ? "s" : ""} ({recipe.missingItems.join(", ")})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
          <Clock size={12} />
          {recipe.time}
          <span>•</span>
          {recipe.tag}
        </div>

        <p className="font-medium text-gray-800 mb-1">{recipe.title}</p>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{recipe.description}</p>

        <button
          onClick={() => onView(recipe.id)}
          className="mt-auto flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium py-2 rounded-lg"
        >
          View Recipe & Cook
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}