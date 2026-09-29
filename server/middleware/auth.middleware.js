const jwt = require("jsonwebtoken");
const util = require("util");

// PROMISES VS CALLBACKS:
// jsonwebtoken's verify() natively supports the OLD callback style:
//   jwt.verify(token, secret, (err, decoded) => { ... })
// which, nested inside Express's own callback-based middleware, would start
// stacking callbacks inside callbacks — the classic "callback hell" pattern.
//
// util.promisify converts that callback-based function into one that
// returns a Promise, so we can use async/await instead — flatter, and
// errors are handled with a single try/catch rather than an `if (err)`
// check inside every nested callback.
const verifyToken = util.promisify(jwt.verify);

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Without promisify, this line would instead look like:
    //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //     if (err) return res.status(401).json({ error: "Invalid or expired token." });
    //     req.user = decoded;
    //     next();
    //   });
    // — functionally identical, but callback-style, and harder to extend
    // if we ever need to await something else afterward in this same function.
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = requireAuth;