const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const logger = require("../middleware/logger");

// Применяем middleware логирования ко всем маршрутам
router.use(logger);

// GET /api/items - все товары (можно фильтровать через ?category=...&purchased=true/false)
router.get("/", itemsController.getAllItems);

// GET /api/items/:id - один товар по ID
router.get("/:id", itemsController.getItemById);

// POST /api/items - создать новый товар
router.post("/", itemsController.createItem);

// PUT /api/items/:id - обновить товар
router.put("/:id", itemsController.updateItem);

// DELETE /api/items/:id - удалить товар
router.delete("/:id", itemsController.deleteItem);

module.exports = router;
