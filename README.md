# Agendify API

Backend API for a barbershop scheduling domain, built with NestJS. This project is intended for study/learning and focuses on a modular architecture (Clean Architecture / DDD-inspired) with use-cases, repositories, and clear boundaries between domain and HTTP.

## Features

- Authentication via JWT (`/auth/sign-in`)
- Register customer and barbershop
- Create and list barbershop services (with optional filters)
- Create, cancel, and list bookings for customer/barbershop

## Requirements

- Node.js + npm
- SQLite (file-based) for local development (via TypeORM)

## Setup

```bash
npm install
```

Create a `.env` file based on `.env_example`.

## Running

```bash
npm run start:dev
```

With `TYPEORM_SYNCHRONIZE=true`, TypeORM will create/update tables automatically in the SQLite file defined by `SQLITE_PATH`.

## Testing

```bash
npm test
```

- Unit tests use mocked repositories.
- E2E tests configure their own in-memory SQLite database inside each test module (they do not depend on the app database file).

## API

### Auth

- `POST /auth/sign-in` → `{ "accessToken": "..." }`

### Customer

- `POST /customer` → `{ user, customer }`

### Barbershop

- `POST /barbershop` → `{ user, barbershop }`

### Barbershop Services

- `POST /barbershop-service` (JWT) → creates a service for a barbershop
- `GET /barbershop-service` → lists services (only active ones) with optional filters:
  - `name`
  - `minPrice`
  - `maxPrice`
  - `barbershopId`

### Bookings

- `POST /booking` (JWT) → create booking
- `POST /booking/:id/cancel` (JWT) → cancel booking
- `GET /booking/customer` (JWT) → list bookings for the logged-in customer
- `GET /booking/barbershop` (JWT) → list bookings for the logged-in barbershop owner

## Authorization rules

- `POST /booking`: only the logged-in user that owns the `customerId` can create a booking
- `POST /booking/:id/cancel`: only the booking's customer user or the barbershop owner can cancel
- `POST /barbershop-service`: only the barbershop owner can create services for their barbershop

## Notes

- HTTP responses are mapped to DTOs (presenters) to avoid returning domain objects directly.
