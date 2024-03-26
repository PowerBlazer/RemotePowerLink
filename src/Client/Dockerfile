FROM node:lts-alpine

WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY ["package.json", "package-lock.json*", "./"]

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы из текущего каталога в рабочую директорию
COPY . .

# Устанавливаем значение API_HOST через аргумент build-аргумент
ARG API_HOST
ENV REACT_APP_API_HOST=$API_HOST

# Определяем порт для serve -s build --listen через переменную окружения
ENV PORT=3000
EXPOSE $PORT

# Установка инструмента serve
RUN npm install -g serve

# Собираем приложение при сборке Docker-образа
RUN npm run build:prod -- --env apiHost=$REACT_APP_API_HOST

# Запускаем serve на указанном порту при запуске контейнера
CMD serve -s build -l $PORT
