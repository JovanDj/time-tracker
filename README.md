# Time Tracker

Monorepo project with Angular 19 (frontend) and Express 5 (backend).  
Uses Node.js 22 (pinned via [Volta](https://volta.sh)) and npm workspaces.

## Prerequisites

- Node.js 22 (Volta will automatically use the correct version)
- npm 10+

## Install

From the repo root:

```bash
npm install
```

Running this in root will install dependencies for both frontend and backend apps.

## Environment configuration

The server requires environment variables for database and app configuration.
A template file with default values is provided.

1. Copy the example file

```bash
cp apps/server/.env.example apps/server/.env
```

This creates a working .env file with safe default values.

2. (Optional) Adjust configuration

Edit apps/server/.env to match your local or production setup:

PORT — server port

POSTGRES\_\* — database credentials

PGADMIN\_\* — pgAdmin credentials

JWT_SECRET, SESSION_SECRET — generate secure random strings for production

3. Run the stack
   docker compose up -d

The app will start using the values from .env.
You can change them anytime and restart the containers to apply new settings.

## Run backend (Express 5)

```bash
npm run dev:server
```

Runs the server in watch mode with tsx.
Default port: 3000.

## Run frontend (Angular 19)

From the apps/client workspace:

```bash
npm --workspace=apps/client start
```

Default port: 4200.

## Run both in parallel

```bash
npm run dev
```

This will start both server and client development servers in parallel.

## Database

Make sure to have docker desktop installed
From the root, run:

```bash
docker compose up -d
```

This will create a postgres container with default credentials

After that run migrations from the server folder:

```bash
cd apps/server
```

```bash
npm run db:migrate
```

This should generate tables in your postgres database.

## Testing

Run all tests from the repo root:

```bash
npm test
```

This runs the server and client workspace test scripts once and exits with a pass/fail status.

Backend tests require Postgres to be running on the configured local port, so start the Docker stack first if needed:

```bash
docker compose up -d
```

Run client tests only with these commands:

```bash
cd apps/client
```

```bash
npm run test
```

For interactive frontend watch mode:

```bash
npm run test:watch
```

## PG Admin

If you run docker-compose, pg-admin should run on port 5050.
You can access it via browser on http://localhost:5050 to inspect the database.

Default email is `admin@mail.com`, and password is `admin`.

## Usage

Open the app in the browser at http://localhost:4200
You will be presented with a login form.
If you already registered before, you can login with email and password
If not, click on the register link and make an account.
Validations for email and password apply.
On successful registration, you should receieve and alert message that you are registered successfuly.
A new user row in the database should be inserted.
On successful login, you should receive a welcome message with your username.
A json web token should be stored in your browsers local storage.
