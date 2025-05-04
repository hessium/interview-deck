# Шаблоны и специализация в C++

## Описание

В этом документе рассматриваются основы шаблонов в C++, включая частичную и полную специализацию, работу с шаблонами стандартной библиотеки (`std::optional`, `std::variant`, `std::tuple`), а также типичные вопросы, встречающиеся на собеседованиях.

---

## Вопросы и ответы

### ❓ Что такое шаблоны в C++?

**Ответ:**  
Шаблоны позволяют писать обобщённый код, который будет работать с разными типами данных. Например, `template<typename T>` позволяет использовать `T` как подстановочный тип.

Пример:
```cpp
template<typename T>
T max(T a, T b) {
    return a > b ? a : b;
}
```

---

### ❓ Что такое полная и частичная специализация шаблонов?

**Ответ:**  
- **Полная специализация** — реализация шаблона для конкретных типов параметров:
```cpp
template<>
struct Foo<int> {
    // Специализация для int
};
```

- **Частичная специализация** — реализация шаблона для части параметров:
```cpp
template<typename T>
struct Foo<T, int> {
    // Специализация, когда второй параметр — int
};
```

---

### ❓ Что произойдет в следующем примере?

```cpp
template<typename A, typename B>
struct Foo {};

template<typename A>
struct Foo<A, float> {};

template<typename B>
struct Foo<int, B> {};

Foo<int, float> x;
```

**Ответ:**  
`Foo<int, float>` соответствует сразу двум специализациям:
- `Foo<A, float>`
- `Foo<int, B>`

Это **двусмысленно** и вызовет ошибку компиляции из-за конфликта специализаций. Для разрешения необходимо использовать более специфичную специализацию или SFINAE/tag dispatching.

---

### ❓ Что такое `SFINAE`?

**Ответ:**  
`SFINAE` — *Substitution Failure Is Not An Error*. Механизм, при котором ошибка при подстановке шаблонных аргументов **не приводит к ошибке компиляции**, если есть другие кандидаты.

Пример:
```cpp
template<typename T>
std::enable_if_t<std::is_integral_v<T>, int> f(T) { return 1; }

template<typename T>
std::enable_if_t<std::is_floating_point_v<T>, int> f(T) { return 2; }
```

---

### ❓ Что такое tag dispatching?

**Ответ:**  
Техника перегрузки функций с использованием пустых структур-тегов:

```cpp
template<typename T>
void impl(T, std::true_type) { /* int logic */ }

template<typename T>
void impl(T, std::false_type) { /* float logic */ }

template<typename T>
void wrapper(T x) {
    impl(x, std::is_integral<T>{});
}
```

---

### ❓ Что важно знать о `std::optional`, `std::variant`, `std::tuple`?

**Ответ:**

- `std::optional<T>` — обёртка, указывающая на возможное отсутствие значения. Используется вместо `nullptr` или флагов.
- `std::variant<T1, T2, ...>` — тип-объединение с безопасным доступом. Подобие `union`, но с типобезопасностью.
- `std::tuple<T1, T2, ...>` — фиксированный набор значений разного типа.

---

### ❓ Чем отличается `variant` от `any`?

**Ответ:**
- `std::variant` — набор фиксированных типов. Компилируется эффективно, без RTTI.
- `std::any` — тип-обёртка для любого значения. Требует RTTI и медленнее работает.

---

### ❓ Как получить тип элемента в `std::tuple`?

**Ответ:**

```cpp
std::tuple<int, float, std::string> t;
using T = std::tuple_element_t<1, decltype(t)>; // T = float
```

---

## Рекомендации

- Используйте `std::enable_if` или `if constexpr` для выбора реализации.
- Не перегружайте шаблоны, если можно использовать tag dispatch.
- Не злоупотребляйте специализацией — предпочтительнее `concepts` в C++20.

