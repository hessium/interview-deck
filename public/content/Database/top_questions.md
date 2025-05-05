# Top questions

## 1. Вопросы по синтаксису

**1.1 В чем разница между `WHERE` и `HAVING`**
`WHERE` фильтрует строки **до** группировки `(GROUP BY)`, а `HAVING` — **после**.
```sql
SELECT department, COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 10; -- ❌ Тут нельзя использовать WHERE
```

**1.2 Чем `UNION` отличается от `UNION ALL`?**

`UNION` убирает дубликаты, `UNION ALL` оставляет.
```sql
SELECT name FROM employees
UNION
SELECT name FROM customers;  -- Дубликаты убраны

SELECT name FROM employees
UNION ALL
SELECT name FROM customers; -- Дубликаты сохраняются
```

**1.3 Как найти дубликаты в таблице?**

Используем `GROUP BY` + `HAVING COUNT(*) > 1`.
```sql
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

**1.4 Как найти 3 самых популярных товара?**

Используем `ORDER BY + LIMIT.`
```sql
SELECT product_id, COUNT(*) as sales
FROM orders
GROUP BY product_id
ORDER BY sales DESC
LIMIT 3;
```

## 2. Что такое нормализация БД?

**Нормализация** — это процесс разбиения данных на связанные таблицы, 
чтобы минимизировать дублирование и повысить целостность данных.

🔹 Формы нормализации:

- 1NF: Нет повторяющихся групп и каждое поле содержит только одно значение.
- 2NF: Все неключевые столбцы зависят только от первичного ключа.
- 3NF: Нет транзитивных зависимостей (неключевые столбцы не зависят друг от друга).
## 3. В чем разница между DELETE, TRUNCATE и DROP?

Команда |	Описание
DELETE	Удаляет данные построчно, можно с WHERE
TRUNCATE	Удаляет все строки сразу (быстрее DELETE)
DROP	Полностью удаляет таблицу

| Команда     | Описание  |
|----------------------|-------------|
| DELETE    | Удаляет данные построчно, можно с WHERE  |
| TRUNCATE     | Удаляет все строки сразу (быстрее DELETE)   |
| DROP     | Полностью удаляет таблицу  |

