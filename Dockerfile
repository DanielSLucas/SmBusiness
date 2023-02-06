FROM ghcr.io/napi-rs/napi-rs/nodejs-rust:lts-alpine

WORKDIR /usr/app

COPY ./cash-book/package.json ./

COPY ./cash-book/package-lock.json ./

RUN npm install -g npm

RUN npm ci

COPY ./cash-book/ .

EXPOSE 3333

CMD ["npm", "run", "start:dev"]