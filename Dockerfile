#syntax=docker/dockerfile:1.4

FROM golang:1.19-alpine AS app_api

ENV GIN_MODE=release
ENV PORT=8080


WORKDIR /srv/app

COPY --link ./api .

RUN go build -o api

ENTRYPOINT ["./api"]


FROM node:18-alpine AS web_stage

WORKDIR /srv/app

COPY --link ./web .

RUN npm i
RUN npm run build


FROM caddy:2.6-alpine AS app_caddy

WORKDIR /srv/app
COPY --from=web_stage --link /srv/app/dist public/
COPY --link docker/caddy/Caddyfile /etc/caddy/Caddyfile


FROM python:3.10-alpine as app_scraper

WORKDIR /srv/app
COPY --link ./scraper .

RUN pip install -r requirements.txt

ADD docker/cron/run-scraper.sh /opt/run-scraper.sh
ADD docker/cron/crontab /etc/cron.d/cron-file
RUN chmod 0644 /etc/cron.d/cron-file
RUN crontab /etc/cron.d/cron-file

CMD ["crond", "-f"]
