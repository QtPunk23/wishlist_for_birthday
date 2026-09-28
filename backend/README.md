# Birthday Wishlist Backend

Backend API for the birthday wishlist app, built with Node.js, Express, and better-sqlite3.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Seed the database (optional — populates initial gift data):

   ```bash
   node seed.js
   ```

   Or use the API endpoint after starting the server:

   ```bash
   curl -X POST http://localhost:3001/api/seed
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001` by default. Set the `PORT` environment variable to change it.

## API Endpoints

### Gifts

| Method | Endpoint              | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/api/gifts`          | Get all guests (no claim info)           |
| GET    | `/api/gifts/admin`    | Get all gifts with claim info (admin)    |
| GET    | `/api/gifts/:id`      | Get a single gift by ID                  |
| POST   | `/api/gifts`          | Add a new gift (admin)                   |
| DELETE | `/api/gifts/:id`      | Delete a gift (admin)                    |

### Claims

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/api/claims`      | Claim a gift                         |
| DELETE | `/api/claims/:id`  | Unclaim a gift (by the claimer)      |

### System

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/api/seed`    | Seed the database with initial data  |

## Project Structure

```
backend/
├── db/
│   └── database.js    # Database connection & initialization
├── routes/
│   ├── gifts.js       # Gift routes
│   └── claims.js      # Claim routes
├── data/              # SQLite database (auto-created)
├── seed.js            # Database seed script
├── server.js          # Express app entry point
└── package.json
```

## Environment Variables

| Variable | Default | Description          |
| -------- | ------- | -------------------- |
| `PORT`   | `3001`  | Server port          |
