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

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="Your_transaction_pooler_supabase_postgre_url"
DIRECT_URL="Your_session_pooler_supabase_postgre_url"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"

# Frontend Configuration
FRONTEND_URL=Your_frontend_deploy_url
```



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

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/auth/signup` | Register a new user | `{ name, email, password }` |
| `POST` | `/auth/login` | Login existing user | `{ email, password }` |
| `GET` | `/me` | Get current user profile | Requires JWT token |

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

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.guard.ts        # JWT guard
│   ├── auth.module.ts       # Auth module
│   └── *.dto.ts            # Data transfer objects
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point
└── prisma.service.ts       # Prisma database service

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Database migrations
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

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Validates all incoming requests
- **CORS Protection**: Configured CORS for frontend integration
- **Environment Variables**: Sensitive data stored in environment variables

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



