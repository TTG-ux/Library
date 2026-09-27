# 📚 Library Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Production-ready система управления библиотекой с JWT-аутентификацией, мониторингом и аналитикой**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api)

</div>

---

## 📖 О проекте

**Library Management System** — это современная веб-приложение для управления библиотекой, разработанное с использованием **Spring Boot 4.1.1** и **Java 21**. Система предоставляет полный функционал для управления книжным фондом, читателями и выдачами книг.

### 🎯 Ключевые возможности

- 🔐 **JWT-аутентификация** с разграничением ролей (Администратор / Читатель)
- 📊 **Аналитический дашборд** с графиками и метриками в реальном времени
- 🔄 **Spring Retry** для отказоустойчивости
- 📝 **Структурированное логирование** с ротацией (SLF4J + Logback)
-  **Spring Actuator** + **Prometheus** + **Grafana** для мониторинга
-  **Docker** и **Docker Compose** для простого развёртывания
- 🎨 **Современный UI** с адаптивным дизайном

---

##  Features

### 👨‍💼 Для администратора

| Функция | Описание |
|---------|----------|
|  Управление книгами | Добавление, редактирование, удаление книг с валидацией ISBN |
| 👥 Управление читателями | Регистрация и управление читателями |
| 🔄 Выдача и возврат | Автоматизация процессов выдачи и возврата книг |
| 📊 Аналитика | Дашборд с KPI, графиками и последними операциями |
|  Поиск и фильтрация | Расширенный поиск по названию, автору, ISBN, году |
| 📈 Статистика | Отчёты по выдачам, просрочкам, активности читателей |

###  Для читателя

| Функция | Описание |
|---------|----------|
|  Мои книги | Просмотр активных выдач с датами возврата |
| ⚠️ Уведомления | Отображение просроченных книг |
| ℹ️ Информация | Подробные пояснения о статусах книг |
| 🔒 Безопасность | Защита личных данных |

---

## 🛠 Tech Stack

### Backend
- **Java 21** — современный язык программирования
- **Spring Boot 4.1.1** — фреймворк для создания приложений
- **Spring Security** — аутентификация и авторизация
- **Spring Data JPA** — работа с базой данных
- **JWT (io.jsonwebtoken 0.12.6)** — токены для аутентификации
- **Spring Retry** — механизм повторных попыток
- **Spring Actuator** — мониторинг и управление
- **Hibernate 7.4.5** — ORM фреймворк

### Frontend
- **HTML5 + CSS3** — семантическая разметка и стили
- **JavaScript (ES6+)** — интерактивность
- **Chart.js 4.4.0** — визуализация данных
- **Font Awesome 6.5.1** — иконки

### Database
- **PostgreSQL 16** (production)
- **H2 Database 2.4.240** (development/testing)

### DevOps
- **Docker** + **Docker Compose** — контейнеризация
- **Prometheus** — сбор метрик
- **Grafana** — визуализация метрик
- **pgAdmin** — администрирование БД

### Инструменты
- **Maven** — сборка проекта
- **Lombok** — уменьшение boilerplate кода
- **Logback** — логирование

---

##  Quick Start

### Требования

- **Docker** 24+ и **Docker Compose** v2+
- **Java 21** (для локальной разработки)
- **Maven** 3.9+ (для локальной сборки)

### Быстрый запуск с Docker

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/library-management.git
cd library-management

# 2. Скопируйте файл переменных окружения
cp .env.example .env

# 3. Запустите приложение
make run

# 4. Откройте в браузере
# http://localhost:8080
