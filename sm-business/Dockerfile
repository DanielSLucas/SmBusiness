FROM ghcr.io/napi-rs/napi-rs/nodejs-rust:lts-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install -g npm

RUN npm i 

COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]