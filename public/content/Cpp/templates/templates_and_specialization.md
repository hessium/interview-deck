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

- **Частичная специализация** позволяет переопределять шаблон не для одного типа, а для набора параметров:
```cpp
template<typename T1, typename T2>
struct Foo {
    void hello() { std::cout << "Generic template\n"; }
};

// Специализация, если второй параметр — int
template<typename T1>
struct Foo<T1, int> {
    void hello() { std::cout << "Partial specialization for <T, int>\n"; }
};

int main() {
    Foo<double, char> obj1; // Generic template
    Foo<double, int> obj2;  // Partial specialization for <T, int>
}
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

### Variadic Templates (Шаблоны с переменным числом параметров)

Добавленные в C++11 и позже, они позволяют работать с произвольным числом шаблонных аргументов.

```c++
template <typename... Args>
void print(Args... args) {
    (std::cout << ... << args) << std::endl;  // Fold expression (C++17)
}

int main() {
    print(1, 2.5, "Hello", 'A');
}

template<typename T>
void print(T t) { std::cout << t << " "; }

//Рекурсивный вызов с уменьшенным списком аргументов
template<typename T, typename... Args>
void print(T t, Args... args) {
    std::cout << t << " ";
    print(args...); // Рекурсивный вызов с уменьшенным списком аргументов
}

```

---

### CRTP (Curiously Recurring Template Pattern)

**CRTP** — это шаблон программирования в C++, при котором класс **наследуется от шаблона**, в который передается **он же сам**:
```c++
template<typename Derived>
class Base {
public:
    void foo() {
        static_cast<Derived*>(this)->impl();
    }
};

class Derived : public Base<Derived> {
public:
    void impl() {
        std::cout << "Derived::impl()" << std::endl;
    }
};

int main() {
    Derived d;
    d.foo(); // Вызывает Derived::impl()
}

```

---

## Рекомендации

- Используйте `std::enable_if` или `if constexpr` для выбора реализации.
- Не перегружайте шаблоны, если можно использовать tag dispatch.
- Не злоупотребляйте специализацией — предпочтительнее `concepts` в C++20.


