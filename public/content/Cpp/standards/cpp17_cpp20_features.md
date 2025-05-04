# Основные особенности C++17 и C++20

## Описание

Эти стандарты продолжают развивать язык, делая его мощнее и удобнее для разработки. C++17 в основном фокусируется на улучшении удобства и производительности, а C++20 вводит радикальные изменения, включая концепции, корутины и ranges.

---

## Особенности C++17

### 1. Структурная распаковка (`structured bindings`)

```cpp
std::pair<int, int> p = {1, 2};
auto [x, y] = p;
```

---

### 2. `if` и `switch` с инициализацией

```cpp
if (auto it = map.find(key); it != map.end()) {
    // ...
}
```

---

### 3. `std::optional`, `std::variant`, `std::any`

- `optional` — тип, который может содержать значение или быть пустым.
- `variant` — безопасная альтернатива `union`.
- `any` — хранит значение любого типа.

```cpp
std::optional<int> maybe = 42;
std::variant<int, std::string> v = "text";
```

---

### 4. `inline` переменные

Позволяет определять глобальные переменные в заголовках:

```cpp
inline int global_setting = 42;
```

---

### 5. `constexpr if`

Позволяет компилировать разные ветки кода в шаблонах:

```cpp
template<typename T>
void print(T val) {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "int: " << val;
    } else {
        std::cout << "other: " << val;
    }
}
```

---

### 6. `std::filesystem`

Работа с файловой системой:

```cpp
std::filesystem::path p = "/tmp/file.txt";
std::cout << std::filesystem::file_size(p);
```

---

## Особенности C++20

### 1. Концепты (`concepts`)

Ограничение параметров шаблонов:

```cpp
template<typename T>
concept Number = std::is_arithmetic_v<T>;

template<Number T>
T add(T a, T b) { return a + b; }
```

---

### 2. Корутинная поддержка (`coroutines`)

Асинхронное программирование:

```cpp
task<int> foo() {
    co_return 42;
}
```

---

### 3. Диапазоны (`ranges`)

Работа с коллекциями с использованием пайпов:

```cpp
#include <ranges>
auto even = vec | std::views::filter([](int x) { return x % 2 == 0; });
```

---

### 4. `consteval`, `constinit`

- `consteval` — функция, вызываемая только на этапе компиляции.
- `constinit` — гарантирует инициализацию на этапе компиляции (но не `constexpr`).

```cpp
consteval int square(int x) { return x * x; }
constinit int value = 42;
```

---

### 5. `modules` (модули)

Заменяют заголовочные файлы, ускоряют компиляцию.

```cpp
import my_module;
```

---

### 6. Три точечных оператора `...` в `using enum`

```cpp
enum class Color { Red, Green, Blue };
using enum Color;

Color c = Red;
```

---

## Частые вопросы на собеседованиях

### ❓ Зачем нужны `optional`, `variant`?

**Ответ:** `optional` безопасно выражает отсутствие значения. `variant` — типобезопасная замена `union`, позволяющая хранить один из нескольких типов.

---

### ❓ Что такое `constexpr if` и как оно помогает?

**Ответ:** Это способ условной компиляции. Например, можно определить разное поведение для типов без SFINAE.

---

### ❓ Как `concepts` упрощают шаблоны?

**Ответ:** Позволяют явно ограничивать типы и улучшать читаемость ошибок компиляции. Заменяют `enable_if` и SFINAE.

---

## Заключение

C++17 — это логичное развитие C++11/14, при этом C++20 делает значительный шаг вперёд, приближая язык к более высокоуровневым возможностям без потери производительности.

