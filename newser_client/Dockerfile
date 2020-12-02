FROM node:14.15.0-alpine3.10 as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build:dev

FROM nginx as production-stage
RUN mkdir /usr/src/app
COPY --from=build-stage /usr/src/app/dist /usr/src/app
COPY nginx.conf /etc/nginx/nginx.conf