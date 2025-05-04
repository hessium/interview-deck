# SFINAE и type_traits в C++

## Описание

В этом документе рассмотрены важные аспекты метапрограммирования в C++: механизм SFINAE, стандартные type traits из `<type_traits>`, а также примеры их применения. Эти темы часто встречаются на собеседованиях при обсуждении шаблонов, генерации кода на этапе компиляции и условной компиляции.

---

## Вопросы и ответы

### ❓ Что такое SFINAE?

**Ответ:**  
SFINAE — это аббревиатура от *Substitution Failure Is Not An Error*. Это правило C++ означает, что если при подстановке шаблонных параметров происходит ошибка, то такая версия шаблона **просто отбрасывается** из множества возможных перегрузок, и компилятор продолжает поиск других подходящих реализаций.

---

### ❓ Как можно использовать SFINAE?

**Ответ:**  
Простейший способ — использовать `std::enable_if`:

```cpp
template<typename T>
std::enable_if_t<std::is_integral_v<T>, void>
func(T value) {
    // Реализация для целочисленных типов
}

template<typename T>
std::enable_if_t<std::is_floating_point_v<T>, void>
func(T value) {
    // Реализация для чисел с плавающей точкой
}
```

Здесь при вызове `func(42)` будет выбрана первая версия, а `func(3.14)` — вторая.

---

### ❓ Как можно сделать enable_if внутри сигнатуры возвращаемого значения?

**Ответ:**

```cpp
template<typename T>
auto func(T value) -> std::enable_if_t<std::is_integral_v<T>, int> {
    return value * 2;
}
```

---

### ❓ Как использовать `std::void_t`?

**Ответ:**  
`void_t` — утилита, упрощающая SFINAE с `template<typename, typename = void>`:

```cpp
template<typename T, typename = void>
struct has_foo : std::false_type {};

template<typename T>
struct has_foo<T, std::void_t<decltype(std::declval<T>().foo())>> : std::true_type {};
```

Такой паттерн позволяет определить, есть ли у типа `T` метод `foo`.

---

### ❓ Какие популярные type_traits существуют?

**Ответ:**

Из `<type_traits>`:
- `std::is_same<T, U>` — true, если T и U одинаковые типы.
- `std::is_integral<T>`, `std::is_floating_point<T>`, `std::is_enum<T>` и т. д.
- `std::remove_reference<T>`, `std::remove_cv<T>`, `std::decay<T>`.
- `std::enable_if`, `std::conditional`, `std::common_type`.

---

### ❓ Пример: написать `is_vector<T>`, возвращающий true только для `std::vector<T>`.

**Ответ:**

```cpp
template<typename T>
struct is_vector : std::false_type {};

template<typename T, typename Alloc>
struct is_vector<std::vector<T, Alloc>> : std::true_type {};
```

---

### ❓ Что такое detection idiom?

**Ответ:**  
Это шаблон, позволяющий "вычислить", поддерживает ли тип определённое выражение, не вызывая ошибку компиляции. Основан на `void_t`:

```cpp
template<typename, template<typename> class, typename = void>
struct is_detected : std::false_type {};

template<typename T, template<typename> class Op>
struct is_detected<T, Op, std::void_t<Op<T>>> : std::true_type {};
```

---

### ❓ Что появилось в C++20?

**Ответ:**  
- `concepts` и `requires` — более выразительные способы задания ограничений на шаблонные параметры, заменяющие необходимость в `enable_if`.
- `std::is_detected` (в TS) — готовый аналог detection idiom.

---

## Рекомендации

- Используйте `if constexpr` в C++17 вместо SFINAE в теле функции, если возможно.
- Для более чистой архитектуры в C++20 — предпочтительны `concepts`.
- Избегайте вложенных `enable_if`, когда можно разбить код на отдельные перегрузки.


