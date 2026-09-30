const BASE_URL = "http://localhost:5000/api/pantry";

// PROMISES: fetch() returns a Promise natively — there's no callback-based
// version of fetch. Every function below uses async/await on top of that
// Promise, which is why our whole API layer reads top-to-bottom instead of
// nesting like callback-based code would.
async function getPantryItems(token) {
  const response = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch pantry items.");
  return response.json();
}

async function addPantryItem(token, item) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to add pantry item.");
  return response.json();
}

async function updatePantryItemQuantity(token, id, quantity) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error("Failed to update pantry item.");
  return response.json();
}

async function deletePantryItem(token, id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete pantry item.");
}

export { getPantryItems, addPantryItem, updatePantryItemQuantity, deletePantryItem };