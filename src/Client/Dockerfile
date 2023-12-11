FROM node:lts-alpine
WORKDIR /app
COPY ["package.json","package-lock.json*","./"]
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 8888
CMD ["npm","start"]


