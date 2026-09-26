import { ChefHat, Package, UtensilsCrossed, BookOpen, Bookmark, Sparkles, Settings, HelpCircle } from "lucide-react";

const navItems = [
  { label: "Pantry", icon: Package, path: "/pantry" },
  { label: "Cook Today", icon: UtensilsCrossed, path: "/cook-today" },
  { label: "Meal Log", icon: BookOpen, path: "/meal-log" },
  { label: "Saved Recipes", icon: Bookmark, path: "/saved" },
];

export default function Sidebar({ activePath, onNavigate }) {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between py-6 px-4 fixed left-0 top-0">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-emerald-800 text-white p-2 rounded-lg">
            <ChefHat size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 leading-tight">RecipeIQ</p>
            <p className="text-xs text-gray-400 leading-tight">Conscious Culinary Kitchen</p>
          </div>
        </div>

        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mb-6">
          <Sparkles size={16} />
          Generate Zero-Waste Meal
        </button>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = activePath === path;
            return (
              <button
                key={path}
                onClick={() => onNavigate(path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <HelpCircle size={18} />
          Kitchen Help
        </button>
      </div>
    </aside>
  );
}