# ACME Demo Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A modern authentication API built with NestJS, featuring user registration, login, and JWT-based authentication with Supabase PostgreSQL database.</p>

## 🚀 Features

- **User Authentication**: Complete signup and login system
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for password security
- **Database Integration**: Supabase PostgreSQL with Prisma ORM
- **Input Validation**: Class-validator for request validation
- **CORS Support**: Configured for frontend integration
- **TypeScript**: Full TypeScript support for type safety

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase PostgreSQL** (or local PostgreSQL v13 or higher)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd acme-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Copy `.env.example` to `.env` and fill it in. The app validates these on startup and refuses to boot if any are missing or invalid.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase transaction pooler (port 6543, `?pgbouncer=true`). URL-encode special characters in the password (`@` → `%40`). |
| `DIRECT_URL` | ✅ | Supabase session pooler (port 5432), used by `prisma migrate`. |
| `JWT_SECRET` | ✅ | ≥ 32 characters — `openssl rand -base64 48`. |
| `FRONTEND_URL` | ✅ | Comma-separated allowed CORS origins, e.g. `http://localhost:5173,https://acme.app`. |
| `JWT_EXPIRES_IN` | | Access token lifetime (default `1h`). |
| `BCRYPT_ROUNDS` | | bcrypt cost 10–14 (default `12`). |
| `PORT` | | Default `3000`. |

### 4. Database Setup

#### Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 📚 API Endpoints

All routes require `Authorization: Bearer <token>` unless marked public.

| Method | Endpoint | Auth | Description | Responses |
|--------|----------|------|-------------|-----------|
| `GET` | `/health` | Public | Liveness + DB check | `200`, `503` |
| `POST` | `/auth/signup` | Public, 5 req/min | `{ name, email, password }` (password 8–72 chars) | `201` user, `400`, `409` email taken |
| `POST` | `/auth/login` | Public, 5 req/min | `{ email, password }` | `200 { accessToken }`, `401`, `429` |
| `GET` | `/me` | Bearer | Current user from the database | `200 { id, name, email, createdAt }`, `401` |

### Example Requests

#### Sign Up
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

#### Get Profile (Authenticated)
```bash
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📦 Project Structure

```
src/
├── auth/
│   ├── decorators/          # @Public(), @CurrentUser()
│   ├── dto/                 # SignUpDto, LoginDto (class-validator)
│   ├── jwt-auth.guard.ts    # Global guard — deny by default
│   ├── auth.service.ts      # bcrypt + JWT
│   └── auth.controller.ts   # /auth/signup, /auth/login (rate limited)
├── users/                   # UsersService + GET /me
├── health/                  # GET /health
├── prisma/                  # Global PrismaModule (single connection pool)
├── config/env.validation.ts # Typed, validated environment
├── app.module.ts
└── main.ts                  # helmet, CORS, ValidationPipe
```

## 🗄️ Database Schema

The application uses the following main entities:

```prisma
model User {
  id          Int      @id @default(autoincrement())
  name        String?
  email       String   @unique
  passwordHash String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔒 Security Features

- **Deny by default**: a global guard protects every route; public routes opt out with `@Public()`
- **Password hashing**: bcrypt (configurable cost), 8–72 character passwords
- **No user enumeration**: identical error and timing for unknown email vs. wrong password
- **Rate limiting**: 100 req/min globally, 5 req/min on `/auth/*`
- **Security headers**: helmet
- **CORS**: explicit origin allow-list from `FRONTEND_URL`
- **Validated config**: the app refuses to start with a weak `JWT_SECRET` or invalid env

## 🚀 Deployment

### Production Deployment

1. **Set Production Environment Variables:**
   ```env
   NODE_ENV=production
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-production-secret
   ```

2. **Build the Application:**
   ```bash
   npm run build
   ```

3. **Start Production Server:**
   ```bash
   npm run start:prod
   ```


## 📊 Assumptions & Trade-offs

### Assumptions

1. **Database**: PostgreSQL is used as the primary database
2. **Authentication**: JWT tokens are sufficient for session management
3. **Password Policy**: Basic password requirements (8+ characters)
4. **Frontend**: React frontend will be deployed on ports 5173/4173
5. **Development**: Local development environment with hot reload

### Trade-offs

1. **Stateless Authentication**: 
   - ✅ Scalable and works well with load balancers
   - ❌ Cannot easily revoke tokens before expiration

2. **Password Hashing**:
   - ✅ Secure with bcrypt
   - ❌ Slower than other methods (intentionally)

3. **Database Migrations**:
   - ✅ Version-controlled schema changes
   - ❌ Requires careful planning for production deployments

4. **Input Validation**:
   - ✅ Prevents malformed data
   - ❌ Additional overhead for request processing

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **JWT Token Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration time
   - Ensure Authorization header format: `Bearer <token>`

3. **CORS Errors:**
   - Verify frontend URL in CORS configuration
   - Check if credentials are enabled if needed

4. **Migration Errors:**
   - Run `npx prisma migrate reset` to reset database
   - Check for conflicting migrations

### Debug Mode

Enable debug mode for detailed logging:

```bash
npm run start:debug
```



