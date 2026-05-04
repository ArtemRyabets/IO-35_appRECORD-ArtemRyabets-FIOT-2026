## 1. Тема, мета, посилання

### 1.1 Тема

«Підключення PostgreSQL до Node.js-застосунку та реалізація CRUD-операцій через Sequelize ORM».

### 1.2 Мета

Підключити PostgreSQL до backend-частини BlogPost Manager, налаштувати Sequelize ORM, створити моделі `User` і `Post`, реалізувати зв'язок One-to-Many та CRUD API для користувачів і публікацій.

### 1.3 Місце розташування

- GitHub застосунку: [посилання буде додано після публікації репозиторію]
- GitHub звітного сайту: [посилання буде додано після публікації репозиторію]

---

## 2. Теоретичні відомості

### 2.1 PostgreSQL

PostgreSQL — реляційна система керування базами даних з підтримкою SQL, зовнішніх ключів, транзакцій та надійного збереження структурованих даних.

### 2.2 Docker Compose

Docker Compose використовується для запуску контейнера PostgreSQL з фіксованими параметрами бази даних, користувача, пароля і порту.

### 2.3 pg і pg-hstore

Пакети `pg` і `pg-hstore` використовуються Sequelize для підключення Node.js-застосунку до PostgreSQL.

### 2.4 Sequelize

Sequelize — ORM для Node.js, яка дозволяє описувати таблиці як JavaScript-моделі, створювати зв'язки між ними та виконувати CRUD-операції без ручного написання кожного SQL-запиту.

---

## 3. Хід виконання

### 3.1 Створення бази даних

Для запуску PostgreSQL додано файл `docker-compose.yml`.

```bash
cd app/server
docker compose up -d
```

Файл `.env.example` містить параметри підключення:

```env
PORT=3000
STORAGE_MODE=database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blogpost_manager
DB_USER=blogpost_user
DB_PASSWORD=blogpost_password
```

![Запуск PostgreSQL через docker compose up -d](/assets/labs/lab-2/lab-2-docker-compose-up.png)

**Рис. 1 – Запуск контейнера PostgreSQL для BlogPost Manager через Docker Compose.**

### 3.2 SQL-запити SELECT, INSERT, UPDATE, DELETE

У папці `app/server/sql/` додано файли:

- `init.sql` — створення бази даних і базових таблиць;
- `crud-examples.sql` — приклади `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

Приклад SQL-запиту:

```sql
SELECT posts.id, posts.title, posts.content, users.name AS author
FROM posts
JOIN users ON users.id = posts."userId";
```

![Виконання SQL-запитів з файлу crud-examples.sql](/assets/labs/lab-2/lab-2-sql-queries.png)

**Рис. 2 – Виконання SQL-запитів `SELECT`, `INSERT`, `UPDATE`, `DELETE` у PostgreSQL.**

### 3.3 Підключення Node.js до PostgreSQL

Підключення винесено у файл `src/config/database.js`. Sequelize отримує параметри з `.env`.

```js
const sequelize = new Sequelize(
  process.env.DB_NAME || "blogpost_manager",
  process.env.DB_USER || "blogpost_user",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
  },
);
```

### 3.4 Структура server/ після додавання БД

```text
app/server/
├── docker-compose.yml
├── package.json
├── .env.example
├── src/
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── index.js
│   ├── routes/
│   │   ├── users.js
│   │   └── posts.js
│   └── seed.js
├── sql/
│   ├── init.sql
│   └── crud-examples.sql
└── README.md
```

### 3.5 Моделі User і Post

Модель `User` містить поля `id`, `name`, `email`. Модель `Post` містить поля `id`, `title`, `content`, `userId`. Поля `createdAt` і `updatedAt` додаються Sequelize автоматично.

### 3.6 Зв'язок One-to-Many

Один користувач може мати багато публікацій. Одна публікація належить одному користувачу.

```js
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
```

### 3.7 CRUD для users

Реалізовано маршрути:

| Метод  | Маршрут      | Призначення                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/users`     | Отримання списку користувачів. |
| GET    | `/users/:id` | Отримання користувача за id.   |
| POST   | `/users`     | Створення користувача.         |
| PUT    | `/users/:id` | Оновлення користувача.         |
| DELETE | `/users/:id` | Видалення користувача.         |

![Postman-запит GET /users](/assets/labs/lab-2/lab-2-get-users.png)

**Рис. 3 – Отримання списку користувачів через маршрут `GET /users`.**

![Postman-запит POST /users](/assets/labs/lab-2/lab-2-create-user.png)

**Рис. 4 – Створення користувача через маршрут `POST /users`.**

### 3.8 CRUD для posts

Реалізовано маршрути:

| Метод  | Маршрут      | Призначення                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/posts`     | Отримання списку публікацій. |
| GET    | `/posts/:id` | Отримання публікації за id.  |
| POST   | `/posts`     | Створення публікації.        |
| PUT    | `/posts/:id` | Оновлення публікації.        |
| DELETE | `/posts/:id` | Видалення публікації.        |

![Postman-запит GET /posts](/assets/labs/lab-2/lab-2-get-posts.png)

**Рис. 5 – Отримання списку публікацій через маршрут `GET /posts`.**

![Postman-запит POST /posts](/assets/labs/lab-2/lab-2-create-post.png)

**Рис. 6 – Створення публікації, пов'язаної з користувачем, через маршрут `POST /posts`.**

### 3.9 Отримання posts разом з user

Для отримання публікацій разом з автором використовується Sequelize `include`.

```js
const posts = await Post.findAll({ include: { model: User, as: "user" } });
```

![Відповідь GET /posts з об'єктом user](/assets/labs/lab-2/lab-2-posts-with-user.png)

**Рис. 7 – Отримання публікацій разом з даними автора через Sequelize `include`.**

### 3.10 Seed-дані

Файл `src/seed.js` очищує таблиці через `sync({ force: true })` і створює тестових користувачів та публікації.

```bash
cd app/server
npm run seed
```

---

## 4. Висновки

До backend-частини BlogPost Manager додано PostgreSQL, Docker Compose і Sequelize ORM. Створено моделі `User` і `Post`, налаштовано зв'язок One-to-Many, реалізовано CRUD API для користувачів і публікацій. Додано отримання публікацій разом з автором, seed-файл для тестових даних і SQL-файли з прикладами базових операцій.
