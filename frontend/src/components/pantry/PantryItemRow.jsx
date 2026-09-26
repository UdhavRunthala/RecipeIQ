export default function PantryItemRow({ item, onQuantityChange, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 mb-2">
      <div>
        <p className="font-medium text-gray-800">{item.ingredientName}</p>
        <p className="text-sm text-gray-400 capitalize">{item.category}</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.id, Number(e.target.value))}
          className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
          min="0"
        />
        <span className="text-gray-500 text-sm w-10">{item.unit}</span>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}