# AI API

## Setup
1. Clone the repository.
2. Install dependencies using your preferred package manager.

## Running
1. Set up environment variables (see below).
2. Build and run the project.

## Docker
2. Build the image: `docker build -t ai-api .`
3. Run the container: `docker run -p 3000:3000 ai-api`

## Database Setup
1. Install and configure PostgreSQL.
2. Update your `.env` with the correct database URL including username, password and port.

## Prisma Setup
Use Prisma for database migrations:
1. `npx prisma migrate dev` (development mode)
2. `npx prisma generate` (generate Prisma Client)

## Environment Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `TOKEN_EXPIRATION`
- `REFRESH_TOKEN_EXPIRATION`

## Using Docker Compose
1. Uncomment the `db` service in `compose.yaml` if you need PostgreSQL.
2. `docker compose up --build`
3. App will run at http://localhost:3000

## Dependencies
- Node.js
- Production:
  - @langchain/openai ^0.4.5
  - @prisma/client ^6.5.0
  - bcrypt ^5.1.1
  - body-parser ^1.20.3
  - cookie-parser ~1.4.4
  - debug ~2.6.9
  - dotenv ^16.4.7
  - eslint ^9.22.0
  - express ^4.21.2
  - jsonwebtoken ^9.0.2
  - langchain ^0.3.19
  - morgan ~1.9.1
  - openai ^4.87.4
- Development:
  - prisma ^6.5.0
  - nodemon ^3.1.9