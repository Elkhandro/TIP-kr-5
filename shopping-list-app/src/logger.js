const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log("Query params:", req.query);
  console.log("Body:", req.body);
  next(); // Передаем управление следующему middleware/обработчику
};

module.exports = logger;
