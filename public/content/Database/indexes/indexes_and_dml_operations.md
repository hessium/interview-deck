# Влияние индексов на INSERT, UPDATE, DELETE

## Описание
Этот файл описывает, как наличие индексов влияет на скорость операций вставки, обновления и удаления данных в таблице.

## Вопросы и ответы

### Как влияет индекс на скорость INSERT/UPDATE/DELETE операций?
- **INSERT**: Все индексы должны быть обновлены при вставке, что может замедлить операцию.
- **UPDATE**: Если обновляется индексируемое поле — нужно пересчитать индекс. Если поле не индексировано — влияние минимально.
- **DELETE**: Требуется удалить запись из таблицы и из всех индексов.

**Вывод**: Индексы ускоряют чтение, но замедляют запись.