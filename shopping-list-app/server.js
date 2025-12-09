const express = require("express");
const itemsRouter = require("./src/routes/itemsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());
// Middleware для парсинга URL-encoded данных
app.use(express.urlencoded({ extended: true }));
// Раздача статических файлов из папки public
app.use(express.static("public"));

// Подключаем маршруты
app.use("/api/items", itemsRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
