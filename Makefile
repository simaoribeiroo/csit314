.PHONY: test build run compose-bootstrap frontend-build backend-build unit e2e

test: build run unit e2e

build: frontend-build backend-build

run:
	$(MAKE) compose-bootstrap
	docker compose exec -T webapp python3 manage.py migrate
	docker compose exec -T webapp python3 manage.py loaddata dummy_data
	echo "Application is running at http://localhost:80"

compose-bootstrap:
	docker compose down --remove-orphans
	docker compose up --build -d

frontend-build:
	npm --prefix frontend ci
	npm --prefix frontend run build

backend-build:
	.venv/bin/python -m pip install --upgrade pip
	.venv/bin/pip install -r backend/requirements.txt
	.venv/bin/python -m compileall backend || true
	.venv/bin/python backend/manage.py check

unit:
	docker compose exec -T -e PYTHONPATH=/app webapp python -m unittest discover -s /app/tests/unit -t /app -p "test_*.py"

e2e:
	npm --prefix tests/e2e install
	npm --prefix tests/e2e test