# Кэширование: стратегии, алгоритмы вытеснения и инвалидация

## Краткое описание

Кэширование — это техника хранения часто используемых данных ближе к пользователю или обработчику, чтобы снизить задержки, нагрузку и стоимость.

![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Caching.jpg)
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Caching_info.jpg)


---

## Вопросы и ответы

### Когда нужно кэшировать?

![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Good_caching_.jpg)


### Какие бывают уровни кэширования?

- **Клиентский кэш** (например, браузер)
- **Кэш CDN** (Cloudflare, Akamai)
- **Промежуточный reverse proxy** (Varnish, Nginx)
- **Кэш приложений** (Memcached, Redis)
- **Кэш в базе данных** (materialized views, query cache)

---

### Какие популярные алгоритмы вытеснения существуют?

- **LRU (Least Recently Used)** — удаляется наименее недавно используемый элемент.

![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/LRU_caching.jpg)

- **LFU (Least Frequently Used)** — удаляется наименее часто используемый.
- **FIFO (First In, First Out)** — удаляется первый добавленный элемент.
- **Random Replacement** — случайное удаление.

---

### Что такое инвалидация кэша?

**Ответ:**
Это процесс удаления или обновления устаревших данных в кэше. Основные стратегии:

- **Time-based** (TTL) — элемент удаляется по истечении времени.
- **Write-through** — запись идёт сразу в кэш и хранилище.
- **Write-back (write-behind)** — запись идёт в кэш, потом асинхронно в хранилище.
- **Cache-busting** — при обновлении контента меняется его URL (например, через query params).

---

### Какие проблемы возникают при кэшировании?

- **Сложность инвалидации** — "труднее, чем кэшировать".
- **Stale data** — кэш может быть устаревшим.
- **Consistency** — данные в кэше и хранилище могут расходиться.
- **Overcaching / Undercaching** — слишком агрессивное или слишком слабое кэширование.

---

### Пример применения

Для ускорения выдачи пользовательских профилей:

- Redis хранит сериализованные данные профиля.
- TTL — 5 минут.
- При обновлении профиля: происходит write-through запись в Redis и PostgreSQL.


