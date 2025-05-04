# Ansible: Основы автоматизации

## 1. Ключевые концепции

**1.1 Идемпотентность**
- Повторное выполнение задачи даёт тот же результат
- Пример:
```yaml
- name: Ensure package is installed
  apt:
    name: nginx
    state: present # Будет установлен только если отсутствует
```

**1.2 Инвентарь (Inventory)**
- Файлы `/etc/ansible/hosts` или `inventory.ini`:
```ini
[webservers]
web1.example.com ansible_user=admin
web2.example.com ansible_port=2222

[databases]
db[1:3].example.com
```

**1.3 Модули**
- Готовые операции для управления системами:
```bash
ansible all -i inventory.ini -m ping
ansible webservers -m apt -a "name=nginx state=present"
```

## 2. Основные компоненты

**2.1 Playbooks (*.yml)**
- Основной формат описания конфигураций:
```yaml
-- name: Configure web server
  hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: latest
```

**2.2 Роли (Roles)**
- Структура каталогов:
```
roles/
  common/
    tasks/
    handlers/
    templates/
    files/
    vars/
    defaults/
```

**2.3 Templates (Jinja2)**
- Динамические конфиги:
```j2
server {
  listen {{ nginx_port }};
  server_name {{ server_name }};
}
```

## 3. Работа с Ansible

**3.1 Основные команды**
```bash
# Проверка доступности хостов
ansible all -m ping

# Запуск playbook
ansible-playbook site.yml --limit webservers

# Создание роли
ansible-galaxy role init my_role
```

**3.2 Полезные модули**
- `copy`: Копирование файлов
- `template`: Генерация конфигов
- `lineinfile`: Изменение строк в файлах
- `systemd`: Управление сервисами
- `git`: Работа с репозиториями

## 4. Best Practices

**4.1 Организация кода**
```
production/
  inventory.ini
  group_vars/
  host_vars/
  site.yml
  roles/
  playbooks/
```

**4.2 Безопасность**
- Используйте `ansible-vault` для секретов:
```bash
ansible-vault encrypt vars/secrets.yml
ansible-playbook --ask-vault-pass site.yml
```

**4.3 Тестирование**
- `molecule`: Тестирование ролей
- `ansible-lint`: Проверка синтаксиса

> **Pro Tip:*> Используйте `--check` для тестового запуска:  
> `ansible-playbook site.yml --check`
