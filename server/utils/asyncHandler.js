// Wraps async route handlers so we don't need try/catch in every controller —
// any thrown error or rejected promise gets forwarded to Express's error handler
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;