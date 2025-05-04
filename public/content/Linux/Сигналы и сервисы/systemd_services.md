# Работа с systemd-сервисами

## Описание
Основы настройки и использования systemd-сервисов.

## Вопросы и ответы

### Вопрос: Как настроить systemd-сервис?
**Ответ:**  
1. Создать unit-файл: `/etc/systemd/system/myapp.service`
```
[Unit]
Description=My App

[Service]
ExecStart=/usr/bin/myapp
Restart=always

[Install]
WantedBy=multi-user.target
```

2. Выполнить:
```bash
sudo systemctl daemon-reexec
sudo systemctl enable myapp
sudo systemctl start myapp
```