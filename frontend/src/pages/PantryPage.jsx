import { useState, useMemo } from "react";
import { Plus, Clock } from "lucide-react";
import { mockPantryItems } from "../data/mockPantry";
import PantryCard from "../components/pantry/PantryCard";

const tabs = ["All", "Fridge", "Pantry", "Freezer"];

export default function PantryPage() {
  const [items, setItems] = useState(mockPantryItems);
  const [activeTab, setActiveTab] = useState("All");

  function handleQuantityChange(id, newQuantity) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    return items.filter((item) => item.location === activeTab);
  }, [items, activeTab]);

  const urgentItems = items.filter((item) => item.freshness.urgent);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Pantry</h1>
          <p className="text-sm text-gray-400">Ingredients you have at home</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg">
          <Plus size={16} />
          Add Ingredient
        </button>
      </div>

      {urgentItems.length > 0 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3 mb-6">
          <Clock size={16} className="text-orange-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {urgentItems.length} ingredients need cooking soon
            </p>
            <p className="text-xs text-gray-500">
              {urgentItems.map((i) => i.name).join(", ")} should be prepared soon.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => {
          const count = tab === "All" ? items.length : items.filter((i) => i.location === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-emerald-800 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab} {tab === "All" ? `(${count})` : count > 0 ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <PantryCard key={item.id} item={item} onQuantityChange={handleQuantityChange} />
        ))}
      </div>
    </div>
  );
}