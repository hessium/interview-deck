# Балансировка нагрузки

## Краткое описание

Балансировка нагрузки — это процесс распределения входящего трафика между несколькими серверами или сервисами для повышения доступности, масштабируемости и отказоустойчивости.

---

## Вопросы и ответы

### Какие есть типы балансировки нагрузки?

- **L3 (IP-уровень)** — работает на уровне IP-пакетов (пример: IP Hash, ECMP).
- **L4 (Transport level)** — учитывает TCP/UDP порты, работает на уровне соединений (пример: Linux ipvs, HAProxy в L4 режиме).
- **L7 (Application level)** — учитывает HTTP-заголовки, URL, cookies и т.п. (пример: Nginx, Envoy, Istio).

---

### Какие алгоритмы балансировки существуют?

- **Round Robin** — простой перебор серверов по кругу.
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Round_Robin.jpg)

- **Weighted Round Robin / Least Connections** — учитывает "вес" серверов.
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/W_Round_Robin.jpg)

- **Least Connections** — выбирается сервер с наименьшим числом активных соединений.
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Least_Connections.jpg)
- **Sticky Hash** — клиентские данные используется как ключ для выбора сервера (устойчиво к сессиям).
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Sticky_Sessions.jpg)
- **Random** — случайный выбор, может быть полезен для хаотичных потоков.

---

### Как работает DNS-балансировка нагрузки?

- Клиент делает DNS-запрос.
- DNS-сервер возвращает один или несколько IP-адресов.
- Работает просто, но не учитывает реальную загрузку серверов.
- Подходит для крупных геораспределённых систем.

![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/DNS.jpg)

---

### Что такое GeoDNS?

**Ответ:**
GeoDNS — способ балансировки нагрузки на уровне DNS с учётом географического положения клиента. DNS-сервер возвращает IP ближайшего сервера к пользователю.
![Screenshot of the structure of the system elements](content/SystemDesign/performance_and_scaling/Geo_DNS.jpg)

---

### Какие проблемы возможны при балансировке нагрузки?

- Сессии (stateful) могут привязывать клиента к конкретному серверу.
- Балансировка на уровне DNS не реагирует на отказ серверов.
- Внутренние кэши DNS могут сохранять устаревшие IP-адреса.


