import { useState } from "react";
import { mockPantryItems } from "../data/mockPantry";
import PantryItemRow from "../components/pantry/PantryItemRow";
import AddItemForm from "../components/pantry/AddItemForm";

export default function PantryPage() {
  // Later, this becomes: const [items, setItems] = useState([]) + useEffect to fetch from API
  const [items, setItems] = useState(mockPantryItems);

  function handleQuantityChange(id, newQuantity) {
    // Later: this becomes a PATCH request to /api/pantry/:id
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  function handleDelete(id) {
    // Later: this becomes a DELETE request to /api/pantry/:id
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAdd(newItem) {
    // Later: this becomes a POST request to /api/pantry
    setItems((prev) => [...prev, newItem]);
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Pantry</h1>

      <AddItemForm onAdd={handleAdd} />

      {items.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Your pantry is empty. Add something above.
        </p>
      ) : (
        items.map((item) => (
          <PantryItemRow
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}