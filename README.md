# Solviser - Full Stack Application

This is a monorepo containing three main applications:
- **API** (Backend): Express.js + Prisma + SQLite (Port 3002)
- **WebApp** (Admin Dashboard): Next.js (Port 3001)  
- **Website** (Public Site): Next.js (Port 3000)

## Prerequisites

- Node.js (v18+ recommended)
- pnpm (package manager)

## ✅ SETUP COMPLETED!

All setup has been completed successfully. You can now run the development servers.

### Current Status:
✅ All dependencies installed  
✅ Database configured and seeded (SQLite)  
✅ Environment variables set up  
✅ Development mode authentication bypass enabled  
✅ All three services ready to run

The API uses PostgreSQL with Prisma ORM. You have two options:

#### Option A: Use Docker (Recommended for Development)
```bash
# Run PostgreSQL in Docker
docker run --name solviser-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=username -e POSTGRES_DB=solviser_db -p 5432:5432 -d postgres:15
```

#### Option B: Install PostgreSQL locally
1. Install PostgreSQL on your system
2. Create a database named `solviser_db`
3. Update the `DATABASE_URL` in `api/.env`

#### Run Database Migrations
```bash
cd api
npx prisma migrate dev
```

## Development Commands

### Individual Services
```bash
# Start API server (http://localhost:3002)
pnpm dev:api

# Start WebApp (http://localhost:3001)  
pnpm dev:webapp

# Start Website (http://localhost:3000)
pnpm dev:website
```

### All Services at Once
```bash
# Start all three services simultaneously
pnpm dev:all
```

### Direct Commands (Alternative)
```bash
# API
pnpm --filter api dev

# WebApp  
pnpm --filter webapp dev

# Website
pnpm --filter website dev
```

## Build Commands

```bash
# Build all projects
pnpm build:all

# Build individual projects
pnpm --filter api build
pnpm --filter webapp build  
pnpm --filter website build
```

## Project Structure

```
├── api/                 # Backend API (Express.js + Prisma)
│   ├── prisma/         # Database schema and migrations
│   ├── src/            # Source code
│   └── .env            # Environment variables
├── webapp/             # Admin dashboard (Next.js)
│   └── app/            # App router structure
├── website/            # Public website (Next.js)
│   └── app/            # App router structure
└── pnpm-workspace.yaml # Workspace configuration
```

## Ports

- **Website**: http://localhost:3000 (Public site)
- **WebApp**: http://localhost:3001 (Admin dashboard)
- **API**: http://localhost:3002 (Backend API)

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `api/.env`
3. Run `npx prisma migrate dev` in the api directory

### Port Conflicts
If ports are already in use, you can modify them in:
- API: `api/package.json` scripts or `PORT` in `.env`
- WebApp: `webapp/package.json` scripts
- Website: `website/package.json` scripts

### Missing Dependencies
```bash
# Reinstall all dependencies
pnpm install:all
```

## Development Tips

1. **Start with the API first** - WebApp and Website depend on it
2. **Check the browser console** for client-side errors
3. **Check terminal output** for server-side errors
4. **Use browser dev tools** to monitor network requests
5. **API endpoints** are available at http://localhost:3002/api/*

## Production Notes

Before deploying:
1. Update all environment variables for production
2. Set `NODE_ENV=production`
3. Build all projects: `pnpm build:all`
4. Set up proper database with migrations
5. Configure proper CORS origins in API