# PostgreSQL: Transactions, Isolation Levels and Concurrency Issues

## 1. ACID Properties

**Atomicity**  
- Guarantees all operations complete successfully or none apply  
- Example:  
```sql  
BEGIN;  
  UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;  
  UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;  
COMMIT; -- Or ROLLBACK on error  
```  

**Consistency**  
- Гарантирует что БД переходит из одного валидного состояния в другое
- Обеспечивается ограничениями (constraints), триггерами и бизнес-правилами 

**Isolation**  
- Реализуется через MVCC (Multiversion Concurrency Control)
- Контролируется уровнями изоляции

**Durability**  
- Обеспечивается WAL (Write-Ahead Logging)
- Гарантированное сохранение данных после COMMIT  

## 2. Уровни изоляции в PostgreSQL

| Уровень изоляции       | Dirty Read | Non-Repeatable Read | Phantom Read | Serialization Anomaly |
|----------------------|------------|----------|----------------|-------|
| Read Uncommitted    | Невозможно     | Возможно  | Возможно        | Возможно |
| Read Committed      | Нет | Возможно | Возможно        | Возможно |
| Repeatable Read     | Нет   | Нет  | Нет       | Возможно |
| Serializable        | Нет | Нет | Нет | Нет |


### Read Uncommitted  
- Not available in PostgreSQL (treated as Read Committed)  

### Read Committed (default)  
- Only sees committed data  
- Example issue:  
```sql  
-- Transaction 1:  
SELECT balance FROM accounts WHERE id = 1; -- Returns 100  

-- Transaction 2:  
UPDATE accounts SET balance = 200 WHERE id = 1;  
COMMIT;  

-- Transaction 1:  
SELECT balance FROM accounts WHERE id = 1; -- Now returns 200!  
```  

### Repeatable Read  
- Guarantees consistent reads within transaction  
- Prevents non-repeatable reads  

### Serializable  
- Highest isolation level  
- Serial execution semantics  

## 3. Concurrency Problems  

**Dirty Read**  
- Reading uncommitted data (impossible in PostgreSQL)  

**Non-Repeatable Read**  
```sql  
-- Transaction 1:  
SELECT * FROM users WHERE id = 1; -- age = 25  

-- Transaction 2:  
UPDATE users SET age = 26 WHERE id = 1;  
COMMIT;  

-- Transaction 1:  
SELECT * FROM users WHERE id = 1; -- age = 26!  
```  

**Phantom Read**  
```sql  
-- Transaction 1:  
SELECT COUNT(*) FROM users WHERE age > 30; -- Returns 5  

-- Transaction 2:  
INSERT INTO users(age) VALUES(35);  
COMMIT;  

-- Transaction 1:  
SELECT COUNT(*) FROM users WHERE age > 30; -- Returns 6!  
```  

**Serialization Anomaly (аномалия сериализации)**

Результат успешной фиксации группы транзакций оказывается несогласованным

| class | value|
|-------|-------|
|    1 |    10 |
|    1 |    20 |
|    2 |   100 |
|     2 |   200 |

Предположим, что сериализуемая транзакция A вычисляет:

```sql 
SELECT SUM(value) FROM mytab WHERE class = 1;
```
а затем вставляет результат (30) в поле value в новую строку со значением class = 2. В это же время сериализуемая транзакция B вычисляет:

```sql 
SELECT SUM(value) FROM mytab WHERE class = 2;
```
получает результат 300 и вставляет его в новую строку со значением class = 1. Затем обе транзакции пытаются зафиксироваться. Если бы одна из этих транзакций работала в режиме Repeatable Read, зафиксироваться могли бы обе; но так как полученный результат не соответствовал бы последовательному порядку, в режиме Serializable будет зафиксирована только одна транзакция, а вторая закончится откатом с ошибкой.


## 4. Solutions  

**Explicit Locking**  
```sql  
SELECT * FROM accounts WHERE user_id = 1 FOR UPDATE;  
SELECT * FROM products WHERE id = 1 FOR SHARE;  
```  

**Optimistic Concurrency**  
```sql  
UPDATE products   
SET stock = stock - 1, version = version + 1   
WHERE id = 1 AND version = 5;  
```  

**Serializable Isolation**  
```sql  
BEGIN ISOLATION LEVEL SERIALIZABLE;  
-- PostgreSQL detects conflicts  
COMMIT;  
```  

> **Note:** Use `SHOW transaction_isolation;` to check current level  
> Prefer Read Committed for most applications  
