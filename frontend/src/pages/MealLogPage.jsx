import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { initialMealLog } from "../data/mockMealLog";
import MealEntryRow from "../components/mealog/MealEntryRow";

export default function MealLogPage() {
  const [log, setLog] = useState(initialMealLog);

  const totalCalories = log.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = log.meals.reduce((sum, m) => sum + m.protein, 0);

  function handleDelete(id) {
    setLog((prev) => ({ ...prev, meals: prev.meals.filter((m) => m.id !== id) }));
  }

  const caloriePct = Math.min(100, (totalCalories / log.calorieGoal) * 100);
  const proteinPct = Math.min(100, (totalProtein / log.proteinGoal) * 100);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Daily Meal Log</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <ChevronLeft size={14} className="cursor-pointer" />
            {log.dateLabel}
            <ChevronRight size={14} className="cursor-pointer" />
          </div>
        </div>
        <button className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg">
          <Plus size={16} />
          Log a Meal
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">CALORIES</p>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {totalCalories} <span className="text-sm text-gray-400 font-normal">/ {log.calorieGoal} kcal</span>
          </p>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-emerald-800 rounded-full" style={{ width: `${caloriePct}%` }} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">PROTEIN</p>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            {totalProtein}g <span className="text-sm text-gray-400 font-normal">/ {log.proteinGoal}g</span>
          </p>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-emerald-800 rounded-full" style={{ width: `${proteinPct}%` }} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">MEALS LOGGED</p>
          <p className="text-xl font-semibold text-gray-800">
            {log.meals.length} <span className="text-sm text-gray-400 font-normal">of {log.meals.length} completed</span>
          </p>
        </div>
      </div>

      <p className="text-xs font-medium text-gray-400 tracking-wide uppercase mb-3">
        Today's Timeline
      </p>

      {log.meals.map((meal) => (
        <MealEntryRow key={meal.id} meal={meal} onDelete={handleDelete} />
      ))}

      <button className="w-full text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg py-3 mt-2 hover:bg-gray-50">
        + Add a snack or drink
      </button>
    </div>
  );
}