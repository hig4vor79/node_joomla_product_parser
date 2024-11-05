const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function main() {
  // Настройки подключения
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "exampleDB",
  });

  let baseUrl = "https://example-joomla.com.ua/catalog";
  let baseImageUrl =
    "https://example-joomla.com.ua/components/com_jshopping/files/img_products";

  try {
    console.log("Подключение к базе данных успешно установлено");

    // Запрос на получение категорий из таблицы
    const [categories] = await connection.query(
      "SELECT category_id, `alias_nb-NO` FROM pariz.bagtop_jshopping_categories"
    );

    // Извлечение id и URL категорий
    const filteredCategories = categories
      .filter((row) => row["alias_nb-NO"].includes("xuping"))
      .map((row) => ({
        id: row.category_id,
        alias: row["alias_nb-NO"], // Сохраняем alias вместе с id
      }));

    console.log("Массив категорий, содержащих 'xuping':", filteredCategories);

    // Создаем массив для хранения всех товаров
    let allProducts = [];

    // Если есть отфильтрованные идентификаторы
    if (filteredCategories.length > 0) {
      // Проходим по каждой категории и получаем продукты
      for (const { id, alias } of filteredCategories) {
        console.log(`Категория: ${alias} (ID: ${id})`); // Выводим название категории

        const [productsToCategories] = await connection.query(
          `SELECT product_id FROM pariz.bagtop_jshopping_products_to_categories WHERE category_id = ?`,
          [id]
        );

        const productIds = productsToCategories.map((row) => row.product_id);
        console.log(
          `ID подходящих продуктов для категории ${alias} (ID: ${id}):`,
          productIds
        );

        if (productIds.length > 0) {
          const [products] = await connection.query(
            `SELECT * FROM pariz.bagtop_jshopping_products WHERE product_id IN (?)`,
            [productIds]
          );

          const resultProducts = products.map((row) => ({
            title: row["name_ru-RU"],
            id: row.product_id,
            price: row.product_price,
            description: row["short_description_ru-RU"],
            product_quantity: row.product_quantity,
            availability:
              row.product_publish == 0 ? "Out of stock" : "In stock",
            image: baseImageUrl.concat("/", row.image),
            link: baseUrl.concat("/", alias, "/", row["alias_ru-RU"]),
          }));

          allProducts.push(...resultProducts); // Сохраняем все продукты
          console.log(
            `Подходящие продукты для категории ${alias} (ID: ${id}):`,
            resultProducts
          );
        } else {
          console.log(
            `Нет подходящих продуктов для категории ${alias} (ID: ${id}).`
          );
        }
      }
    } else {
      console.log("Нет категорий, содержащих 'xuping'.");
    }

    // Создание XML структуры
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`;
    const feedOpening = `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">`;
    const feedTitle = `<title>Elsnab</title>`;
    const feedLink = `<link>https://elsnab.com.ua</link>`;
    const feedUpdated = `<updated>${new Date().toISOString()}</updated>`;
    const feedEntries = allProducts
      .map(
        (product) => `
      <entry>
        <g:title>${product.title}</g:title>
        <g:link>${product.link}</g:link>
        <g:price>${product.price} UAH</g:price>
        <g:id>${product.id}</g:id>
        <g:availability>${product.availability.toLowerCase()}</g:availability>
        <g:description><![CDATA[${product.description}]]></g:description>
        <g:image_link>${product.image}</g:image_link>
      </entry>
    `
      )
      .join("");

    const xmlContent = `${xmlHeader}
    ${feedOpening}
      ${feedTitle}
      ${feedLink}
      ${feedUpdated}
      ${feedEntries}
    </feed>`;

    // Запись в файл feed.xml
    fs.writeFileSync(path.join(__dirname, "feed.xml"), xmlContent);
    console.log("Файл feed.xml успешно создан.");
  } catch (err) {
    console.error("Ошибка при выполнении запроса:", err);
  } finally {
    // Закрытие соединения после завершения всех запросов
    await connection.end();
    console.log("Соединение закрыто.");
  }
}

// Запуск основной функции
main();
