## 1. Тема, мета, посилання

### 1.1 Тема
«Розроблення HTTP-сервера та REST API для web-застосунку BlogPost Manager засобами Node.js та Express.js».

### 1.2 Мета
Реалізувати серверну частину BlogPost Manager на Node.js і Express.js, створити REST API для ресурсу `posts`, додати обробку помилок і підготувати приклади тестування маршрутів.

### 1.3 Місце розташування
- GitHub застосунку: [посилання буде додано після публікації репозиторію]
- GitHub звітного сайту: [посилання буде додано після публікації репозиторію]

---

## 2. Теоретичні відомості

### 2.1 Node.js
Node.js — середовище виконання JavaScript поза браузером. Воно використовується для створення серверних застосунків, API, консольних утиліт та інших backend-рішень.

### 2.2 Express.js
Express.js — мінімалістичний web-фреймворк для Node.js. Він спрощує створення HTTP-сервера, маршрутизацію, обробку JSON-запитів і підключення middleware.

### 2.3 REST API
REST API — підхід до організації взаємодії з ресурсами через HTTP. У BlogPost Manager ресурсом є `posts`, а основні операції реалізовано через методи `GET`, `POST`, `PUT`, `DELETE`.

Предметна область адаптована під BlogPost Manager, тому замість умовного ресурсу `students` реалізовано REST-операції для ресурсу `posts`.

---

## 3. Хід виконання

### 3.1 Структура server/
```text
app/server/
├── package.json
├── .env.example
├── src/
│   ├── server.js
│   ├── routes/
│   │   └── posts.js
│   └── models/
└── README.md
```

### 3.2 Реалізація HTTP-сервера
У файлі `src/server.js` створено Express-застосунок, підключено `express.json()`, маршрут перевірки сервера `GET /` і маршрути для `posts`.

```js
app.get("/", (req, res) => {
  res.json({
    message: "BlogPost Manager API is running.",
    storageMode: app.locals.storageMode,
  });
});
```

### 3.3 Маршрути posts
Для ресурсу `posts` реалізовано такі маршрути:

| Метод | Маршрут | Призначення |
|---|---|---|
| GET | `/posts` | Отримання списку публікацій. |
| GET | `/posts/:id` | Отримання однієї публікації за id. |
| POST | `/posts` | Створення нової публікації. |
| PUT | `/posts/:id` | Оновлення публікації. |
| DELETE | `/posts/:id` | Видалення публікації. |

### 3.4 Опис GET, POST, PUT, DELETE
`GET` використовується для читання даних без зміни стану сервера. `POST` створює новий ресурс. `PUT` повністю оновлює ресурс за id. `DELETE` видаляє ресурс за id.

На етапі ЛР1 частини 2 дані можуть зберігатися в пам'яті сервера. Для цього використовується режим `STORAGE_MODE=memory`.

### 3.5 Обробка помилок
Додано обробку таких ситуацій:
- ресурс не знайдено;
- не передано обов'язкові поля;
- невідомий маршрут;
- внутрішня помилка сервера.

Приклад відповіді для відсутнього ресурсу:

```json
{
  "message": "Post not found."
}
```

### 3.6 Тестування через браузер, curl або Postman
![Запуск сервера командою npm run start:memory](/assets/labs/lab-1-part-2/lab-1-part-2-server-start.png)

**Рис. 1 – Запуск Express-сервера BlogPost Manager у режимі збереження даних у пам'яті.**

![Postman-запит GET /posts](/assets/labs/lab-1-part-2/lab-1-part-2-get-posts.png)

**Рис. 2 – Отримання списку блогових публікацій через маршрут `GET /posts`.**

![Postman-запит GET /posts/:id](/assets/labs/lab-1-part-2/lab-1-part-2-get-post-by-id.png)

**Рис. 3 – Отримання однієї публікації за ідентифікатором через маршрут `GET /posts/:id`.**

![Postman-запит POST /posts](/assets/labs/lab-1-part-2/lab-1-part-2-create-post.png)

**Рис. 4 – Створення нової блогової публікації через маршрут `POST /posts`.**

![Postman-запит PUT /posts/:id](/assets/labs/lab-1-part-2/lab-1-part-2-update-post.png)

**Рис. 5 – Оновлення блогової публікації через маршрут `PUT /posts/:id`.**

![Postman-запит DELETE /posts/:id](/assets/labs/lab-1-part-2/lab-1-part-2-delete-post.png)

**Рис. 6 – Видалення блогової публікації через маршрут `DELETE /posts/:id`.**

![Postman-запит до невідомого маршруту](/assets/labs/lab-1-part-2/lab-1-part-2-invalid-route.png)

**Рис. 7 – Обробка помилки для невідомого маршруту.**

![Postman-запит з некоректним тілом](/assets/labs/lab-1-part-2/lab-1-part-2-invalid-input.png)

**Рис. 8 – Обробка помилки валідації під час створення публікації.**

Приклад запиту:

```bash
curl http://localhost:3000/posts
```

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Новий пост","content":"Текст публікації","author":"Артем Рябець"}'
```

---

## 4. Висновки

Реалізовано базовий HTTP-сервер на Node.js та Express.js. Для BlogPost Manager створено REST API ресурсу `posts` з операціями отримання, створення, оновлення та видалення публікацій. Додано перевірку вхідних даних, обробку відсутніх ресурсів і невідомих маршрутів. Серверна структура підготовлена до розширення в наступній лабораторній роботі через підключення PostgreSQL і Sequelize.
