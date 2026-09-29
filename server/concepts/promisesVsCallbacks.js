// ============================================
// JavaScript — Promises vs Callbacks
// Run with: node concepts/promisesVsCallbacks.demo.js
// ============================================

const fs = require("fs");

// ---- OLD STYLE: callbacks ----
// Notice the nesting required if you need to do two things in sequence —
// this is "callback hell", and it only gets worse with more steps.
function oldStyleReadThenLog(path, callback) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) return callback(err);
    fs.stat(path, (err, stats) => {
      if (err) return callback(err);
      callback(null, { data, size: stats.size });
    });
  });
}

// ---- MODERN STYLE: Promises ----
// Same two-step operation, but flat instead of nested, and errors are
// caught in one place instead of being checked after every single step.
const fsPromises = require("fs/promises");

function modernPromiseVersion(path) {
  return fsPromises
    .readFile(path, "utf8")
    .then((data) =>
      fsPromises.stat(path).then((stats) => ({ data, size: stats.size }))
    );
}

// ---- BEST: async/await (syntactic sugar over Promises) ----
// Reads like synchronous code, but is still fully non-blocking underneath.
async function asyncAwaitVersion(path) {
  const data = await fsPromises.readFile(path, "utf8");
  const stats = await fsPromises.stat(path);
  return { data, size: stats.size };
}

// Demo run (reads this very file as the example)
async function run() {
  console.log("Running async/await version:");
  const result = await asyncAwaitVersion(__filename);
  console.log("File size:", result.size, "bytes");
}

run();

// ---- Where this matters in RecipeIQ ----
// Our pg queries (pool.query(...)) and our OpenAI API calls both return
// Promises. Throughout the whole backend we consistently use async/await
// (see any controller in server/controllers/) rather than .then() chains
// or raw callbacks — specifically because a request handler often needs to
// do several sequential steps (e.g. "look up the recipe, THEN look up its
// ingredients, THEN update the pantry") and async/await keeps that readable.
// asyncHandler (server/utils/asyncHandler.js) exists specifically to catch
// promise rejections from these async functions and forward them to Express's
// error handler — without it, a rejected promise inside a route would crash
// the process instead of returning a proper error response.