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
