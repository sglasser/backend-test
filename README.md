# Installation

## Docker

To set up the environment, you will need to first install [Docker](https://docs.docker.com/engine/install/).
This test uses Docker Compose to run everything.

## Backend Server

The backend server uses Node.js, but you don't need to have that installed on your machine. You can install
the dependencies by running:

```bash
docker compose run server npm i
```

## Database

To bring up the database:

```bash
docker compose up -d db
```

Once it's ready to go, you can run the schema migrator to build the schema and add sample data to the database:

```bash
docker compose run migrate
```

If that fails (because of something like an already existing table), you can always start with a clean slate
by bringing the DB container down:

```bash
docker compose down
```
# Backend-test

There is very basic set of unit tests for worker.service.ts

```bash
npm run test
```

# API documentation
Swagger docs are generated and can be found at:

```bash
localhost:3000/docs
```