FROM ghcr.io/napi-rs/napi-rs/nodejs-rust:lts-alpine

WORKDIR /usr/app

COPY ./package.json ./

COPY ./package-lock.json ./

RUN npm install -g npm

RUN npm ci

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start:dev"]