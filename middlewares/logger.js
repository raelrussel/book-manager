module.exports = (req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body: ${JSON.stringify(req.body || {})}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`-> ${res.statusCode} ${res.statusMessage || ''}; ${duration}ms`);
  });
  next();
};
