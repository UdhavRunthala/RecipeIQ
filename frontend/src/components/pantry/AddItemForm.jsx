import { useState } from "react";

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !quantity) return;

    onAdd({
      id: Date.now(), // temporary fake id until backend assigns a real one
      ingredientName: name.trim(),
      category: "uncategorized",
      quantity: Number(quantity),
      unit,
    });

    setName("");
    setQuantity("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Ingredient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-24 border border-gray-300 rounded px-3 py-2"
        min="0"
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="border border-gray-300 rounded px-2 py-2"
      >
        <option value="pcs">pcs</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="ml">ml</option>
        <option value="l">l</option>
      </select>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
      >
        Add
      </button>
    </form>
  );
}