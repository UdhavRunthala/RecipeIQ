// ============================================
// CALLBACK STYLE vs PROMISE STYLE — side by side
// Both functions do the same thing: show a toast message after a short
// delay, then report whether it was shown successfully.
// ============================================

// --- CALLBACK STYLE ---
// The old pattern: pass a function (the callback) that gets invoked later,
// with an (error, result) signature. No Promise object is involved at all.
function showToastCallback(message, callback) {
  if (!message) {
    // Callback-style error handling: pass the error as the first argument
    return callback(new Error("No message provided"), null);
  }

  setTimeout(() => {
    console.log("[toast - callback style]:", message);
    callback(null, { shown: true, message });
  }, 300);
}

// --- PROMISE STYLE ---
// The modern pattern: wrap the same async work in a Promise, which lets
// the caller use .then()/.catch() OR async/await instead of passing in
// a callback function.
function showToastPromise(message) {
  return new Promise((resolve, reject) => {
    if (!message) {
      reject(new Error("No message provided"));
      return;
    }

    setTimeout(() => {
      console.log("[toast - promise style]:", message);
      resolve({ shown: true, message });
    }, 300);
  });
}

export { showToastCallback, showToastPromise };