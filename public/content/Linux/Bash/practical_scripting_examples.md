# Practical Scripting Examples in Bash

Реальные примеры скриптов для автоматизации задач с подробными пояснениями.

---

## 1. Парсинг и анализ логов  
### Пример: Анализ nginx-логов  
```bash  
# Подсчёт TOP-10 IP-адресов  
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 10  

# Поиск 5xx ошибок  
grep '" 5[0-9][0-9] ' access.log | awk '{print $9, $7}' | sort | uniq -c  
```  

---

## 2. Автоматизация бэкапов  
### Пример: Ротация бэкапов  
```bash  
#!/bin/bash  
BACKUP_DIR="/backups"  
MAX_BACKUPS=7  

# Создание бэкапа  
tar -czf "$BACKUP_DIR/backup_$(date +%Y%m%d).tar.gz" /data  

# Удаление старых бэкапов  
ls -t "$BACKUP_DIR" | tail -n +$((MAX_BACKUPS + 1)) | xargs -I {} rm "$BACKUP_DIR/{}"  
```  

---

## 3. Мониторинг системы  
### Пример: Проверка дискового пространства  
```bash  
#!/bin/bash  
THRESHOLD=90  

df -h | awk '$NF=="/"{print $5}' | cut -d% -f1 | while read usage; do  
  if [ $usage -ge $THRESHOLD ]; then  
    echo "Warning: Disk usage $usage%" | mail -s "Disk Alert" admin@example.com  
  fi  
done  
```  

---

## 4. Обработка CSV-файлов  
### Пример: Конвертация CSV в JSON  
```bash  
#!/bin/bash  
INPUT="data.csv"  
OUTPUT="data.json"  

echo "[" > $OUTPUT  
tail -n +2 $INPUT | while IFS=, read -r id name value; do  
  echo "  {"id": "$id", "name": "$name", "value": $value}," >> $OUTPUT  
done  
sed -i '$ s/,$//' $OUTPUT  
echo "]" >> $OUTPUT  
```  

---

## 5. Опасные антипаттерны  
### Что НЕ нужно делать:  
1. **Использование неэкранированных переменных:**  
   ```bash  
   rm -rf $DIR/*     # Опасно! Если DIR пуст, выполнится `rm -rf /*`  
   ```  
   **Исправление:**  
   ```bash  
   [ -n "$DIR" ] && rm -rf "$DIR"/*  
   ```  

2. **Игнорирование кодов возврата:**  
   ```bash  
   command || echo "Failed"   # Продолжает выполнение после ошибки  
   ```  
   **Исправление:**  
   ```bash  
   command || { echo "Failed"; exit 1; }  
   ```  

---

> **Pro tip:** Всегда тестируйте скрипты на тестовых данных перед использованием в продакшене.  
> Для сложных задач используйте `jq` (JSON), `csvkit` (CSV) или Python-скрипты.