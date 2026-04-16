# IronFa

اپ ورزشی فارسی برای ثبت و مدیریت تمرینات.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, localStorage (در حال migration) |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 |
| Runtime | Node.js 18+ |

## Project Structure

```text
ironfa repo root/
├── src/          # React frontend (Vite)
├── public/
├── backend/      # Express API
│   ├── src/
│   ├── prisma/
│   └── .env
├── index.html
└── vite.config.js (در ironfa/)
```

## Prerequisites

- Node.js 18+
- PostgreSQL 16

## Setup

### 1. Database

یک دیتابیس PostgreSQL به نام `ironfa_db` بساز.

### 2. Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Frontend

```bash
cd ironfa
npm install
npm run dev
```

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check endpoint for the Express API |
| `POST` | `/api/users` | Register a new user |
| `POST` | `/api/users/login` | Log in an existing user |
| `GET` | `/api/workouts` | List workouts |
| `POST` | `/api/workouts` | Create a workout |
| `GET` | `/api/exercises` | List exercises |
| `POST` | `/api/exercises` | Create an exercise |

## Environment Variables

فایل `backend/.env`:

```env
DATABASE_URL=
PORT=3001
```

## Contributing

- روی یک branch جداگانه کار کن.
- تغییرات را با commit message واضح ثبت کن.
- قبل از push، build و migrationهای مرتبط را چک کن.

## License

در حال حاضر لایسنس جداگانه‌ای برای پروژه تعریف نشده است.
