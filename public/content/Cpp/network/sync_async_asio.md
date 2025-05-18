# Boost asio примеры синхронного и асинхронного сетевого сервера

## Описание

Этот файл содержит обзор тем, связанных с правильным написание клиент серверного взаимодействия. Как выглядит синхронный сервер. Как выглядит асинхронный сервер. Другие вопросы связанные с библиотекой boost::asio

---

## Синхронный TCP-сервер с двумя очередями сообщений

```c++
// server_sync.cpp

using boost::asio::ip::tcp;

std::deque<std::string> incoming_messages;
std::deque<std::string> processing_queue;
std::mutex queue_mutex;

void accept_and_read(tcp::acceptor& acceptor) {
    while (true) {
        tcp::socket socket(acceptor.get_executor().context());
        acceptor.accept(socket);

        char data[1024];
        boost::system::error_code ec;
        size_t length = socket.read_some(boost::asio::buffer(data), ec);

        if (!ec) {
            std::string msg(data, length);
            std::lock_guard<std::mutex> lock(queue_mutex);
            incoming_messages.push_back(msg);
        }
    }
}

void process_messages() {
    while (true) {
        {
            std::lock_guard<std::mutex> lock(queue_mutex);
            if (!incoming_messages.empty()) {
                processing_queue.swap(incoming_messages);  // Быстрое перемещение без копирования
            }
        }

        while (!processing_queue.empty()) {
            std::string msg = processing_queue.front();
            processing_queue.pop_front();
            std::cout << "Processing: " << msg << std::endl;
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}

int main() {
    try {
        boost::asio::io_context io_context;
        tcp::acceptor acceptor(io_context, tcp::endpoint(tcp::v4(), 12345));

        std::thread accept_thread([&]() { accept_and_read(acceptor); });
        std::thread process_thread(process_messages);

        accept_thread.join();
        process_thread.join();
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
}
```

- `incoming_messages` — защищённая mutex очередь, куда складываются данные.
- `processing_queue` — локальная очередь, с которой работает поток обработки.
- `swap` между ними — атомарная операция с точки зрения std::mutex (мгновенное переключение, не копируя элементы).
- Такой подход снижает время захвата мьютекса и минимизирует блокировки.

🧠 Это эффективный способ организации работы в синхронных моделях, где прием и обработка идут в разных потоках.

---

## Асинхронный TCP-сервер

```c++
// server_async.cpp
using boost::asio::ip::tcp;

class session : public std::enable_shared_from_this<session> {
public:
    session(tcp::socket socket) : socket_(std::move(socket)) {}

    void start() {
        do_read();
    }

private:
    void do_read() {
        auto self(shared_from_this());
        socket_.async_read_some(boost::asio::buffer(data_),
            [this, self](boost::system::error_code ec, std::size_t length) {
                if (!ec) {
                    std::string msg(data_.data(), length);
                    std::cout << "Received: " << msg << std::endl;
                    do_read();
                }
            });
    }

    tcp::socket socket_;
    std::array<char, 1024> data_;
};

class server {
public:
    server(boost::asio::io_context& io_context, short port)
        : acceptor_(io_context, tcp::endpoint(tcp::v4(), port)) {
        do_accept();
    }

private:
    void do_accept() {
        acceptor_.async_accept(
            [this](boost::system::error_code ec, tcp::socket socket) {
                if (!ec) {
                    std::make_shared<session>(std::move(socket))->start();
                }
                do_accept();
            });
    }

    tcp::acceptor acceptor_;
};

int main() {
    try {
        boost::asio::io_context io_context;
        server s(io_context, 12345);
        io_context.run();
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }
}
```
---

## Важные моменты

### boost::asio::io_context — что это?

`io_context` (`io_service`) — это основной объект в Boost.Asio, который:

- Является "движком событий": обрабатывает асинхронные операции (чтение, запись, таймеры и т.д.).
- Управляет очередью задач (completion handlers), которые нужно выполнить.
- Вызывается через метод `run()`, который запускает цикл обработки событий.

### tcp::acceptor — что это?

`tcp::acceptor` — это объект, который слушает входящие TCP-соединения:

- Привязывается к IP-адресу и порту с помощью метода bind.
- Слушает соединения (listen()).
- Принимает подключения (async_accept() или accept()).
- После установления соединения создаётся `tcp::socket`, через который будет происходить общение с клиентом.

### Как обслуживать нескольких клиентов без потоков?

Да, можно обслуживать несколько клиентов без потоков, если использовать асинхронный API Boost.Asio:

- async_accept() принимает входящее соединение, не блокируя основной поток.
- async_read() / async_write() позволяют читать и писать, не блокируя.
- Все события ставятся в очередь `io_context` и обрабатываются по мере готовности.

Под капотом — это реакторная модель: один поток может обслуживать тысячи соединений за счёт неблокирующих операций и колбэков.

1. Ты вызываешь, например:

```c++
boost::asio::async_read(socket, buffer, handler);
```
Boost.Asio не выполняет операцию сразу, а регистрирует её в своей внутренней структуре (**event loop**).

2. `io_context::run()` запускает цикл событий
Это запускает бесконечный цикл, в котором:

- Запрашиваются события от ОС через системные вызовы (epoll, select, IOCP, ...).
- Когда ОС сообщает о готовности (например, "на этом сокете можно читать") — Boost.Asio вызывает твой handler.

```c++
    boost::asio::io_context io;
    tcp::acceptor acceptor(io, {...});
    start_accept(acceptor);

    io.run(); // поток "застревает" здесь
 ```

### Как запускать Boost.Asio в нескольких фоновых потоках

Boost.Asio по умолчанию не создает потоки сам — ты сам решаешь, сколько потоков нужно.
Если у тебя много клиентов / соединений — выгодно использовать несколько потоков:

```c++
boost::asio::io_context io_context;
boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard(io_context.get_executor());

std::vector<std::thread> threads;
for (int i = 0; i < std::thread::hardware_concurrency(); ++i) {
    threads.emplace_back([&io_context]() {
        io_context.run();  // каждый поток будет обрабатывать события
    });
}

// … позже
io_context.stop();
for (auto& t : threads) t.join();
```

**Что это даёт:**
- Распараллеливание обработки I/O.
- Каждое соединение может быть обслужено в любом потоке.
- Не нужно вручную распределять клиентов по потокам.

--- 

### Зачем нужен таймаут на connect / write / read

Потому что Asio НЕ разрывает соединения автоматически по тайм-ауту!
Если сервер молчит, или клиент завис — твой `async_read()` **может ждать вечно**.

```c++

```

Почему Boost.Asio не делает таймауты сам?
- Он не знает, сколько ждать — это зависит от логики приложения.
- Он даёт тебе гибкость — ты сам определяешь: 5 секунд? 30? Всегда?

Когда соединение может быть завершено автоматически?
1. Удалённая сторона закрыла соединение (TCP FIN)
`boost::asio::error::connection_reset` это реакция уже на принимающей стороне.
2. Локальное закрытие сокета
```c++
socket.close();
socket.cancel();
```
Опять же, это инициируется тобой, не библиотекой автоматически.

3. Ошибки в соединении (например, connection reset)
- Удалённый хост недоступен
- Произошла ошибка TCP (RST)
- Сетевой кабель выдернули

--- 