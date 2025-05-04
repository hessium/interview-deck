# Coroutines in C++: Concepts and Libraries

## 1. Основные концепции корутин

**1.1 Что такое корутины?**
- Функции с возможностью приостановки и возобновления
- Сохраняют состояние между вызовами
- Альтернатива потокам для асинхронных операций

**1.2 Ключевые компоненты**
- `co_await`: Приостановка выполнения
- `co_yield`: Возврат значения с приостановкой
- `co_return`: Завершение корутины

## 2. Популярные библиотеки

**2.1 C++20 Standard Library**
- Встроенная поддержка корутин
- Требует ручного написания promise-типов
- Пример:
```cpp
#include <coroutine>

task<int> compute_value() {
    co_return 42;
}
```

**2.2 Boost.Coroutine2 (Наиболее популярная)**
- Полноценная поддержка stackful-корутин
- Проще в использовании чем стандарт C++20
- Пример:
```cpp
#include <boost/coroutine2/all.hpp>

void coro_func(boost::coroutines2::coroutine<void>::push_type& yield) {
    yield(); // Приостановка
}
```

**2.3 Boost.Asio (для асинхронности)**
- Интеграция корутин с IO-операциями
- Пример:
```cpp
awaitable<void> async_read(tcp::socket& sock) {
    char data[128];
    co_await sock.async_read_some(buffer(data), use_awaitable);
}
```

## 3. Подробные примеры Boost

**3.1 Boost.Coroutine2**
```cpp
#include <boost/coroutine2/all.hpp>
#include <iostream>

void producer(boost::coroutines2::coroutine<int>::push_type& sink) {
    for(int i=0; i<3; ++i) {
        std::cout << "Producing: " << i << "n";
        sink(i); // Передача значения и приостановка
    }
}

int main() {
    boost::coroutines2::coroutine<int>::pull_type source(producer);
    for(auto val : source) {
        std::cout << "Consumed: " << val << "n";
    }
}
```

**3.2 Boost.Asio с корутинами**
```cpp
#include <boost/asio.hpp>
#include <boost/asio/experimental/awaitable_operators.hpp>
using namespace boost::asio::experimental::awaitable_operators;

awaitable<void> parallel_operations() {
    auto [r1, r2] = co_await (
        async_op1() && async_op2()
    );
    // Обе операции завершены
}
```

## 4. Сравнение подходов

| Характеристика       | C++20 | Boost.Coroutine2 | Boost.Asio |
|----------------------|---------|------------------|------------|
| Тип корутин          | Stackless | Stackful        | Stackless |
| Требует ручного кода | Да       | Нет              | Нет        |
| Интеграция с IO      | Нет      | Нет              | Да         |
| Производительность   | Высокая  | Средняя          | Высокая    |

## 5. Best Practices

1. Для общего использования - Boost.Coroutine2
2. Для сетевых приложений - Boost.Asio корутины
3. Для новых проектов - стандарт C++20
4. Избегайте смешивания разных реализаций

> **Важно:*> Boost.Coroutine2 требует линковки с `-lboost_context`  
> Для Asio корутин нужен `-fcoroutines` в GCC/-await в MSVC
