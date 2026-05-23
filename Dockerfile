FROM node:24-alpine AS frontend
WORKDIR /src/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

FROM python:3.12-slim as final
WORKDIR /app
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./backend ./
COPY ./tests ./tests
COPY --from=frontend /src/frontend/dist ./static
EXPOSE 80
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
