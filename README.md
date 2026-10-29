# Surf Session API 🌊

A RESTful API for tracking surf sessions and surf spots, built with **NestJS, TypeScript, Supabase, and PostgreSQL**.

This project explores backend development best practices, secure authentication, user-specific data access, API design, and automated testing.

## Features

- **Authentication:** User authentication powered by Supabase Auth.
- **Surf session management:** Create, list, retrieve, and delete surf sessions.
- **Surf spot management:** Associate surf sessions with surf spots.
- **User data isolation:** Protect user data through authenticated requests and Supabase Row Level Security (RLS).
- **Pagination:** Retrieve surf history with pagination metadata.
- **Health check:** Endpoint to verify API availability.
- **Automated testing:** Unit tests and end-to-end testing.

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Type-safe development |
| Supabase | Authentication and database integration |
| PostgreSQL | Relational database |
| Vitest | Unit testing and coverage |
| Supertest | HTTP and end-to-end testing |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- A Supabase project

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with your repository URL and project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Get these values from your Supabase project settings.

**Security:** Never commit your `.env` file or expose secret keys in your repository. Use the publishable key for client-style access and rely on authentication and properly configured Row Level Security policies to protect user data.

### 4. Run the application

Start the development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

### 5. Check API health

Send a GET request to:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "timestamp": "2026-10-29T18:00:00.000Z"
}
```

The timestamp is generated at request time. This endpoint checks application availability; it does not necessarily verify database connectivity.

## API Overview

The API supports surf session tracking, including session duration, wave count, surf date, and associated surf spot.

| Resource | Operations |
|---|---|
| Authentication | User authentication through Supabase Auth |
| Surf sessions | Create, list, retrieve, and delete sessions |
| Surf spots | Retrieve and manage surf spots according to the implemented routes |
| Health | Check API availability |

Authenticated endpoints require a valid access token where configured.

Include the token in the request header:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

For exact paths, request parameters, and response schemas, refer to the controllers and DTOs in the source code.

## Testing

Run the test suite with Vitest:

```bash
npx vitest run
```

Run tests with coverage:

```bash
npx vitest run --coverage
```

The project includes tests for service behavior, error handling, and API health checks.

## Project Goals

This project is part of my ongoing development as a software engineer, with a focus on:

- Designing RESTful APIs with NestJS.
- Implementing authentication and authorization.
- Integrating PostgreSQL through Supabase.
- Handling errors and validating request data.
- Applying unit testing and end-to-end testing.
- Improving maintainability and separation of concerns.

## Future Improvements

Potential next steps include:

- Add API documentation with Swagger/OpenAPI.
- Add database connectivity checks to the readiness endpoint.
- Expand end-to-end coverage for authenticated routes.
- Add CI workflows to run tests automatically.
- Improve API documentation with request and response examples.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute or allow others to reuse this project.
