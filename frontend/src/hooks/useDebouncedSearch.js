import { useState, useEffect, useRef } from "react";

// CALLBACKS VS PROMISES, side by side in one hook:
//
// setTimeout is a genuine callback-based browser API — it takes a plain
// function to run later, with no Promise involved. We use it here to
// "debounce" the search box: instead of firing a search on every keystroke,
// we wait until the user pauses typing for 400ms.
//
// Once that callback DOES fire, it kicks off `onSearch(value)`, which is
// expected to be an async function (Promise-based) — e.g. a fetch call.
// So this one hook genuinely uses both patterns for what each is actually
// good at: setTimeout for "run this later," and a Promise/async-await for
// "run this network request and let me await its result."
export default function useDebouncedSearch(onSearch, delayMs = 400) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any pending callback from the previous keystroke
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Callback-style: setTimeout takes a plain function, not a Promise
    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        // Promise-style: onSearch is async — we don't await it here since
        // this effect itself isn't async, but the caller's onSearch
        // internally uses async/await against fetch()
        onSearch(value);
      }
    }, delayMs);

    // Cleanup: cancel the pending callback if the component unmounts
    // or the value changes again before the timeout fires
    return () => clearTimeout(timeoutRef.current);
  }, [value, delayMs, onSearch]);

  return [value, setValue];
}