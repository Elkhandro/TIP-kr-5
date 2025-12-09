const fs = require("fs").promises;
const path = require("path");

const itemsPath = path.join(__dirname, "../../data/items.json");

// Чтение данных из файла
const readItems = async () => {
  try {
    const data = await fs.readFile(itemsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Запись данных в файл
const writeItems = async (items) => {
  await fs.writeFile(itemsPath, JSON.stringify(items, null, 2));
};

// GET все товары (с фильтрацией через query-параметры)
const getAllItems = async (req, res) => {
  try {
    let items = await readItems();

    // Фильтрация по query-параметрам
    if (req.query.category) {
      items = items.filter(
        (item) =>
          item.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    if (req.query.purchased !== undefined) {
      const purchased = req.query.purchased === "true";
      items = items.filter((item) => item.purchased === purchased);
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при чтении данных" });
  }
};

// GET один товар по ID
const getItemById = async (req, res) => {
  try {
    const items = await readItems();
    const item = items.find((item) => item.id === parseInt(req.params.id));

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Товар не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

// POST создать новый товар
const createItem = async (req, res) => {
  try {
    const items = await readItems();
    const newItem = {
      id: Date.now(), // Простой способ генерации ID
      name: req.body.name,
      quantity: req.body.quantity || 1,
      category: req.body.category || "Без категории",
      purchased: false,
    };

    // Валидация
    if (!newItem.name) {
      return res.status(400).json({ error: "Название товара обязательно" });
    }

    items.push(newItem);
    await writeItems(items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании товара" });
  }
};

// PUT обновить товар
const updateItem = async (req, res) => {
  try {
    const items = await readItems();
    const index = items.findIndex(
      (item) => item.id === parseInt(req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    // Обновляем только переданные поля
    items[index] = {
      ...items[index],
      ...req.body,
      id: items[index].id, // ID не меняем
    };

    await writeItems(items);
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении товара" });
  }
};

// DELETE удалить товар
const deleteItem = async (req, res) => {
  try {
    let items = await readItems();
    const initialLength = items.length;

    items = items.filter((item) => item.id !== parseInt(req.params.id));

    if (items.length === initialLength) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    await writeItems(items);
    res.json({ message: "Товар удален" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении товара" });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
