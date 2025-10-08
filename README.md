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

Run client tests with these commands:

```bash
cd apps/client
```

```bash
npm run test
```

## Usage

Open the app in the browser at http://localhost:4200
You will be presented with a login form.
If you already registered before, you can login with email and password
If not, click on the register link and make an account.
Validations for email and password apply.
On successful registration, you should receieve and alert message that you are registered successfuly.
A new user row in the database should be inserted.
On successful login, you should receive a welcome message.
