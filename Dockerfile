FROM node:lts-alpine3.19 AS builder

COPY ./package.json /app/package.json
# COPY ./package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install -g npm@10.8.0
RUN npm install
COPY ./ /app
RUN npm run build

FROM node:lts-alpine3.19

RUN apk add nginx

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm ci --omit dev
COPY --from=builder /app/build /app
COPY nginx/default.conf /etc/nginx/http.d/default.conf
COPY --chmod=0755 nginx/startup.sh /app/startup.sh

EXPOSE 8090
ENTRYPOINT ["/app/startup.sh"]