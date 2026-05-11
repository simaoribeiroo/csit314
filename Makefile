.PHONY: test build frontend-build backend-build unit e2e

test: build unit e2e

build: frontend-build backend-build

frontend-build:
	npm --prefix frontend ci
	npm --prefix frontend run build

backend-build:
	python -m pip install --upgrade pip
	pip install -r backend/requirements.txt
	python -m compileall backend
	python backend/manage.py check

unit:
	PYTHONPATH=backend python -m unittest discover -s tests/unit -p "test_*.py"

e2e:
	npm --prefix tests/e2e ci
	npm --prefix tests/e2e test