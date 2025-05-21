up:
	docker-compose up --build

migrate:
	docker-compose exec backend python manage.py migrate

down:
	docker-compose down

.PHONY: up migrate down

