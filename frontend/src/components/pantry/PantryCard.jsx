import { Minus, Plus } from "lucide-react";
import { showToastCallback, showToastPromise } from "../../utils/notify";

export default function PantryCard({ item, onQuantityChange }) {
  const { name, subLabel, location, freshness, quantity, unit } = item;

  function handleIncrease() {
    const newQuantity = quantity + 1;
    onQuantityChange(item.id, newQuantity);

    // CALLBACK STYLE in real use: pass a function to be called once the
    // toast has "finished" — this is the pattern you'd see in older
    // browser APIs and libraries that predate Promises.
    showToastCallback(`${name} updated to ${newQuantity} ${unit}`, (err, result) => {
      if (err) {
        console.error("Toast failed:", err.message);
        return;
      }
      console.log("Callback confirmed:", result);
    });
  }

  function handleDecrease() {
    const newQuantity = Math.max(0, quantity - 1);
    onQuantityChange(item.id, newQuantity);

    // PROMISE STYLE in real use: .then()/.catch() chaining instead of a
    // callback function. Same underlying async work, different pattern.
    showToastPromise(`${name} updated to ${newQuantity} ${unit}`)
      .then((result) => console.log("Promise resolved:", result))
      .catch((err) => console.error("Toast failed:", err.message));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
          {location}
        </span>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            freshness.urgent
              ? "bg-orange-50 text-orange-500"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {freshness.label}
        </span>
      </div>

      <p className="font-medium text-gray-800">{name}</p>
      <p className="text-sm text-gray-400 mb-4">{subLabel}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Quantity</span>
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
          <button onClick={handleDecrease} className="text-gray-400 hover:text-gray-700">
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {quantity} {unit}
          </span>
          <button onClick={handleIncrease} className="text-gray-400 hover:text-gray-700">
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}