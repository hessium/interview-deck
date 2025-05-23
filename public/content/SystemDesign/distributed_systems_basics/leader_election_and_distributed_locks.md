# Выборы лидера и распределённые блокировки

## Краткое описание

В распределённых системах важной задачей является координация. Для этого используются механизмы выборов лидера и распределённые блокировки. Они обеспечивают согласованное поведение нескольких узлов без гонок и конфликтов.

---

## Вопросы и ответы

### Зачем нужен лидер в распределённой системе?

**Ответ:**
Лидер — это узел, принимающий решения от имени группы. Он координирует:

- Репликацию данных (например, в Raft/Paxos)
- Выдачу блокировок
- Планирование задач
- Ответы клиентам

---

### Какие алгоритмы используются для выборов лидера?

##### **Bully Algorithm** — самый "сильный" (по ID) узел становится лидером. Работает при условии, что узлы знают ID других.
##### **Raft** — современный, простой в реализации алгоритм консенсуса с поддержкой выборов лидера.

**Основные идеи Raft**
1. Выбор лидера

- Узлы голосуют за одного кандидата.
- Тот, кто набирает большинство голосов (кворум), становится лидером.
- Лидер отправляет heartbeat-сообщения (AppendEntries), чтобы поддерживать статус.
2. Лог репликации

- Клиенты отправляют запросы только лидеру.
- Лидер добавляет команду в свой лог и реплицирует её на follower'ов.
- Когда большинство узлов подтверждают запись — команда считается примененной.

3. Безопасность данных

- Если новый лидер выбран, он гарантированно содержит все подтвержденные команды.
- Старые лидеры не могут "откатить" данные.

##### **Paxos** — классический алгоритм достижения консенсуса, включает фазы подготовки и акцепта.

---

### Какие бывают подходы к распределённым блокировкам?

- **С использованием централизованного хранилища:**
  - Redis (с использованием Redlock)
  - Zookeeper
  - etcd
- **Через базы данных**:
  - `SELECT ... FOR UPDATE`
  - Advisory Locks (PostgreSQL)

---

### Что такое Redlock?

**Ответ:**
Redlock — алгоритм от Redis для реализации безопасной распределённой блокировки. Он работает с несколькими независимыми Redis-инстансами, чтобы обеспечить отказоустойчивость.

---

### Какие проблемы есть у распределённых блокировок?

- **Гарантии владения:** узел может "думать", что владеет блокировкой, хотя связь с координационным сервисом потеряна.
- **Гарантии надёжности:** блокировка может "застрять" у умершего узла, если TTL не выставлен.
- **Требования к часам**: многие алгоритмы (например, Redlock) чувствительны к системному времени.


