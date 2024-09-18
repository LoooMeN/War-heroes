FROM python:3.12-alpine

WORKDIR /app

COPY .docker/entrypoint.sh .
ENTRYPOINT [ "sh", "./entrypoint.sh" ]

RUN apk add --no-cache libpq-dev gcc musl-dev
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache pip install -r requirements.txt

COPY . .