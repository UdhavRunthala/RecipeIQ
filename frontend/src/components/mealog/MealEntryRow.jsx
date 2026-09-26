import { Sun, UtensilsCrossed, Moon, Pencil, Trash2 } from "lucide-react";

const iconByType = {
  BREAKFAST: Sun,
  LUNCH: UtensilsCrossed,
  DINNER: Moon,
};

export default function MealEntryRow({ meal, onDelete }) {
  const Icon = iconByType[meal.mealType] || UtensilsCrossed;

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs text-gray-400">
            {meal.mealType} • Logged at {meal.time}
          </p>
          <p className="font-medium text-gray-800">{meal.name}</p>
          <p className="text-xs text-gray-400">
            {meal.calories} kcal • {meal.protein}g protein
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-400">
        <button className="hover:text-gray-600">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(meal.id)} className="hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}