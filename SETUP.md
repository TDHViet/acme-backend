# Quick Setup Guide

## Environment Variables

Create a `.env` file in the backend root directory with the following content:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/acme_demo?schema=public"
DIRECT_URL="postgresql://username:password@localhost:5432/acme_demo?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run database migrations
npx prisma migrate dev

# 4. Start development server
npm run start:dev
```

## Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```sql
   CREATE DATABASE acme_demo;
   ```
3. **Update DATABASE_URL** in `.env` with your PostgreSQL credentials
4. **Run migrations** to create tables

## Testing API

Use these curl commands to test the API:

```bash
# Sign up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Get profile (replace YOUR_JWT_TOKEN with actual token)
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

For more detailed information, see the main README.md file.
