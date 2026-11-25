# EVM API (server)

Express + MongoDB backend for the Elite Vision Media website.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then set MONGODB_URI (local MongoDB or Atlas)
npm run dev            # nodemon, http://localhost:5000
# or: npm start
```

The frontend dev server (Vite, port 5173) proxies `/api` to `http://localhost:5000`.

## Endpoints

| Method | Path           | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/api/health`  | Server + database status        |
| POST   | `/api/contact` | Submit a Contact Us enquiry     |

### POST /api/contact

```json
{
  "firstName": "Vinoth",
  "lastName": "Kumar",
  "email": "example@gmail.com",
  "phone": "+919876543210",
  "services": ["Digital Marketing", "Video Production"],
  "message": "Optional"
}
```

- `201` `{ "success": true, "message": "...", "data": { "id": "..." } }`
- `422` `{ "success": false, "message": "...", "errors": { "field": "message" } }`
- `503` database unavailable

`.env` holds real credentials and is git-ignored. Never commit it.
