// ============================================
// JavaScript — The Event Loop
// Run with: node concepts/eventLoop.demo.js
// ============================================

console.log("1. Start — synchronous code runs first");

// setTimeout callback goes into the macrotask queue
setTimeout(() => {
  console.log("4. setTimeout callback (macrotask) — runs after all sync code and microtasks");
}, 0);

// Promise .then() callback goes into the microtask queue — runs BEFORE macrotasks
Promise.resolve().then(() => {
  console.log("3. Promise .then() (microtask) — runs after sync code, before setTimeout");
});

console.log("2. End — last synchronous line");

// Expected output order:
// 1. Start
// 2. End
// 3. Promise .then()
// 4. setTimeout callback
//
// Why: the call stack must be completely empty before the event loop even
// looks at queued tasks. Once empty, it always drains ALL microtasks
// (promises) before running even one macrotask (setTimeout, setInterval, I/O).

// ---- Where this matters in RecipeIQ ----
// Every Express request handler is inherently part of this same event loop.
// When a controller does:
//   const pantryItems = await getPantryItemsForUser(userId);   // DB query (I/O)
//   const suggestions = await callOpenAI(pantryItems);          // network call (I/O)
// neither of these blocks the server — while Postgres or OpenAI is doing work,
// Node is free to handle OTHER users' requests. This is exactly why a single-
// threaded Node server can still serve many concurrent users: it's not doing
// the waiting itself, it's just registered a callback for "let me know when
// this I/O finishes" and moved on.