# Solviser Monorepo

A modern full-stack application built with Next.js, Express.js, and TypeScript, organized as a monorepo using Turborepo and pnpm workspaces.

## Architecture

- **apps/api** - Express.js REST API with Prisma ORM
- **apps/webapp** - Next.js 14 web application with app router
- **apps/website** - Next.js 14 marketing website
- **packages/** - Shared packages and utilities

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **React 18**

### Backend
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Redis**
- **TypeScript**

### DevOps & Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solviser
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/webapp/.env.example apps/webapp/.env
cp apps/website/.env.example apps/website/.env
```

4. Start development servers:
```bash
# Start all apps
pnpm dev

# Or start individual apps
pnpm --filter @solviser/api dev
pnpm --filter @solviser/webapp dev
pnpm --filter @solviser/website dev
```

### Database Setup

1. Start PostgreSQL (using Docker):
```bash
docker-compose up postgres -d
```

2. Run database migrations:
```bash
cd apps/api
pnpm db:migrate
```

3. Generate Prisma client:
```bash
cd apps/api
pnpm db:generate
```

## Development

### Available Scripts

```bash
# Development
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm type-check   # Type check all apps
pnpm format       # Format code with Prettier
pnpm clean        # Clean build artifacts

# Database (from apps/api)
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Prisma Studio
```

### Project Structure

```
solviser/
├── apps/
│   ├── api/                 # Express.js API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   └── package.json
│   ├── webapp/              # Next.js Web App
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── package.json
│   └── website/             # Next.js Website
│       ├── app/
│       ├── components/
│       ├── lib/
│       ├── styles/
│       └── package.json
├── packages/                # Shared packages
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Deployment

### Using Docker

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the applications:
- API: http://localhost:3001
- WebApp: http://localhost:3000  
- Website: http://localhost:3002

### Environment Variables

Each app requires specific environment variables. See the `.env.example` files in each app directory for required variables.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.