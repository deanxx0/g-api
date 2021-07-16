FROM node:16-alpine

WORKDIR /app

COPY .npmrc .
COPY package.json .
COPY package-lock.json .

RUN npm ci --only=prod
RUN rm -f .npmrc

COPY . .

CMD ["npm", "start"]