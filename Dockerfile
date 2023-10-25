FROM node:18.16.1

COPY . /app/

WORKDIR /app

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]
