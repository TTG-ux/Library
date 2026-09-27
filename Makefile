
# Library Management System - Makefile

.PHONY: help build run stop clean logs test restart \
        dev prod monitoring tools db-backup db-restore \
        lint format check-status health

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Переменные
APP_NAME = library-app
DB_NAME = library-db
COMPOSE_FILE = docker-compose.yml

# Справка
help: ## Показать список доступных команд
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║     Library Management System - Makefile Commands          ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Примеры использования:$(NC)"
	@echo "  make build          - Собрать Docker образ"
	@echo "  make run            - Запустить приложение"
	@echo "  make dev            - Запустить в режиме разработки"
	@echo "  make stop           - Остановить приложение"
	@echo "  make logs           - Просмотреть логи"
	@echo "  make clean          - Очистить всё"

# Основные команды
build: ## Собрать Docker образ
	@echo "$(BLUE)🔨 Сборка Docker образа...$(NC)"
	docker compose -f $(COMPOSE_FILE) build --no-cache
	@echo "$(GREEN)✅ Образ успешно собран!$(NC)"

build-quick: ## Быстрая сборка (с кэшем)
	@echo "$(BLUE)🔨 Быстрая сборка Docker образа...$(NC)"
	docker compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)✅ Образ успешно собран!$(NC)"

run: build ## Собрать и запустить приложение
	@echo "$(BLUE)🚀 Запуск приложения...$(NC)"
	docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ Приложение запущено!$(NC)"
	@echo "$(YELLOW)📱 Приложение доступно по адресу: http://localhost:8080$(NC)"
	@echo "$(YELLOW)️  База данных доступна по адресу: localhost:5432$(NC)"

stop: ## Остановить приложение
	@echo "$(YELLOW)⏹️  Остановка приложения...$(NC)"
	docker compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)✅ Приложение остановлено!$(NC)"

restart: stop run ## Перезапустить приложение
	@echo "$(GREEN)✅ Приложение перезапущено!$(NC)"

clean: ## Полная очистка (контейнеры, образы, тома)
	@echo "$(RED)🧹 Полная очистка...$(NC)"
	@read -p "Вы уверены? Это удалит все данные! (y/N) " confirm && [ $$confirm = y ] || exit 0
	docker compose -f $(COMPOSE_FILE) down -v --rmi all --remove-orphans
	docker system prune -f
	@echo "$(GREEN)✅ Очистка завершена!$(NC)"

clean-data: ## Очистить только данные (тома)
	@echo "$(RED)️  Очистка данных...$(NC)"
	@read -p "Вы уверены? Все данные будут удалены! (y/N) " confirm && [ $$confirm = y ] || exit 0
	docker compose -f $(COMPOSE_FILE) down -v
	@echo "$(GREEN)✅ Данные удалены!$(NC)"

# Логи и мониторинг
logs: ## Просмотреть логи приложения
	docker compose -f $(COMPOSE_FILE) logs -f $(APP_NAME)

logs-db: ## Просмотреть логи базы данных
	docker compose -f $(COMPOSE_FILE) logs -f $(DB_NAME)

logs-all: ## Просмотреть все логи
	docker compose -f $(COMPOSE_FILE) logs -f

status: ## Статус контейнеров
	@echo "$(BLUE)📊 Статус контейнеров:$(NC)"
	docker compose -f $(COMPOSE_FILE) ps

health: ## Проверить здоровье приложения
	@echo "$(BLUE)🏥 Проверка здоровья...$(NC)"
	@curl -s http://localhost:8080/actuator/health | python3 -m json.tool || echo "$(RED)❌ Приложение недоступно$(NC)"

# Режимы запуска
dev: ## Запуск в режиме разработки (H2)
	@echo "$(BLUE)🛠️  Запуск в режиме разработки...$(NC)"
	SPRING_PROFILES_ACTIVE=dev docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ Dev режим запущен!$(NC)"
	@echo "$(YELLOW) http://localhost:8080$(NC)"

prod: ## Запуск в production режиме
	@echo "$(BLUE) Запуск в production режиме...$(NC)"
	SPRING_PROFILES_ACTIVE=prod docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ Production режим запущен!$(NC)"

monitoring: ## Запуск с мониторингом (Prometheus + Grafana)
	@echo "$(BLUE)📈 Запуск с мониторингом...$(NC)"
	docker compose -f $(COMPOSE_FILE) --profile monitoring up -d
	@echo "$(GREEN)✅ Мониторинг запущен!$(NC)"
	@echo "$(YELLOW)📊 Prometheus: http://localhost:9090$(NC)"
	@echo "$(YELLOW)📉 Grafana: http://localhost:3000$(NC)"

tools: ## Запуск с инструментами (pgAdmin)
	@echo "$(BLUE)🔧 Запуск с инструментами...$(NC)"
	docker compose -f $(COMPOSE_FILE) --profile tools up -d
	@echo "$(GREEN)✅ Инструменты запущены!$(NC)"
	@echo "$(YELLOW)🗄️  pgAdmin: http://localhost:5050$(NC)"

all: ## Запуск всего (приложение + мониторинг + инструменты)
	@echo "$(BLUE)🚀 Запуск всех сервисов...$(NC)"
	docker compose -f $(COMPOSE_FILE) --profile monitoring --profile tools up -d
	@echo "$(GREEN)✅ Все сервисы запущены!$(NC)"
	@echo "$(YELLOW)📱 Приложение: http://localhost:8080$(NC)"
	@echo "$(YELLOW)🗄️  pgAdmin: http://localhost:5050$(NC)"
	@echo "$(YELLOW)📊 Prometheus: http://localhost:9090$(NC)"
	@echo "$(YELLOW)📉 Grafana: http://localhost:3000$(NC)"

# База данных
db-backup: ## Создать резервную копию БД
	@echo "$(BLUE)💾 Создание резервной копии...$(NC)"
	@mkdir -p ./backups
	@TIMESTAMP=$$(date +%Y%m%d_%H%M%S); \
	docker exec $(DB_NAME) pg_dump -U $${DB_USERNAME:-library} librarydb > ./backups/librarydb_$$TIMESTAMP.sql
	@echo "$(GREEN)✅ Резервная копия создана: ./backups/librarydb_$$TIMESTAMP.sql$(NC)"

db-restore: ## Восстановить БД из резервной копии
	@echo "$(YELLOW)⚠️  Восстановление БД...$(NC)"
	@read -p "Укажите файл резервной копии: " backup_file; \
	if [ -f $$backup_file ]; then \
		cat $$backup_file | docker exec -i $(DB_NAME) psql -U $${DB_USERNAME:-library} -d librarydb; \
		echo "$(GREEN)✅ База данных восстановлена!$(NC)"; \
	else \
		echo "$(RED) Файл не найден: $$backup_file$(NC)"; \
		exit 1; \
	fi

db-shell: ## Подключиться к БД через psql
	@echo "$(BLUE)🔌 Подключение к базе данных...$(NC)"
	docker exec -it $(DB_NAME) psql -U $${DB_USERNAME:-library} -d librarydb

# Тестирование и разработка
test: ## Запустить тесты
	@echo "$(BLUE)🧪 Запуск тестов...$(NC)"
	docker compose -f $(COMPOSE_FILE) run --rm $(APP_NAME) mvn test
	@echo "$(GREEN)✅ Тесты завершены!$(NC)"

shell: ## Подключиться к контейнеру приложения
	docker exec -it $(APP_NAME) /bin/sh

db-shell: ## Подключиться к контейнеру БД
	docker exec -it $(DB_NAME) psql -U $${DB_USERNAME:-library} -d librarydb

# Обновление и обслуживание
update: ## Обновить образы и перезапустить
	@echo "$(BLUE)🔄 Обновление...$(NC)"
	docker compose -f $(COMPOSE_FILE) pull
	docker compose -f $(COMPOSE_FILE) up -d --build
	@echo "$(GREEN)✅ Обновление завершено!$(NC)"

prune: ## Очистить неиспользуемые Docker ресурсы
	@echo "$(BLUE)🧹 Очистка Docker ресурсов...$(NC)"
	docker system prune -f
	docker volume prune -f
	@echo "$(GREEN)✅ Очистка завершена!$(NC)"

# Информация
info: ## Показать информацию о проекте
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║           Library Management System - Info                 ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Версия:$(NC) 2.0.0"
	@echo "$(GREEN)Java:$(NC)    21"
	@echo "$(GREEN)Spring:$(NC)  Boot 4.1.1"
	@echo "$(GREEN)Database:$(NC) PostgreSQL 16"
	@echo ""
	@echo "$(YELLOW)Endpoints:$(NC)"
	@echo "   Приложение:  http://localhost:8080"
	@echo "  🗄️  H2 Console:  http://localhost:8080/h2-console"
	@echo "  🏥 Health:      http://localhost:8080/actuator/health"
	@echo "  📊 Metrics:     http://localhost:8080/actuator/prometheus"
	@echo "  ℹ️  Info:        http://localhost:8080/actuator/info"
	@echo ""
	@echo "$(YELLOW)Credentials:$(NC)"
	@echo "  👨‍💼 Admin:   admin / admin123"
	@echo "  📚 Reader:  reader / reader123"