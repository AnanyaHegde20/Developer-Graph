# DevGraph Backend

Backend API for DevGraph - a developer skill, project, and career recommendation platform.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- CognoDB Cloud instance (or Neo4j compatible database)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your CognoDB credentials:
   - `COGNODB_URI`: Your CognoDB connection string
   - `COGNODB_USERNAME`: Database username
   - `COGNODB_PASSWORD`: Database password
   - `PORT`: Server port (default: 5000)

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /health` - Check server and database health

### Developers
- `GET /api/developers/search?q=<searchTerm>` - Search developers
- `GET /api/developers/:id` - Get developer by ID
- `GET /api/developers/:id/skills` - Get developer skills
- `GET /api/developers/:id/projects` - Get developer projects
- `GET /api/developers/:id/companies` - Get developer companies
- `GET /api/developers/:id/job-targets` - Get developer job targets

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/search?q=<searchTerm>` - Search skills
- `GET /api/skills/category/:category` - Get skills by category
- `GET /api/skills/:id` - Get skill by ID
- `GET /api/skills/:id/related` - Get related skills

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/search?q=<searchTerm>` - Search projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/:id/technologies` - Get project technologies
- `GET /api/projects/:id/skills` - Get project required skills
- `GET /api/projects/:id/developers` - Get project developers

### Recommendations
- `GET /api/recommendations/developer/:id/skill-project-tech` - Multi-hop traversal
- `GET /api/recommendations/developer/:id/skill-gap` - Skill gap analysis
- `GET /api/recommendations/developer/:id/project-recommendations` - Project recommendations
- `GET /api/recommendations/technology/stats` - Technology usage statistics
- `GET /api/recommendations/company/skill-distribution` - Company skill distribution

## Architecture

```
src/
├── config/           # Environment configuration
├── controllers/      # Request handlers
├── cypher/           # Cypher query files
├── database/         # Database connection and seed
├── middleware/        # Express middleware
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript interfaces
└── index.ts          # Application entry point
```

## Graph Data Model

See [cypher/GRAPH_MODEL.md](../cypher/GRAPH_MODEL.md) for detailed documentation of the graph data model.

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## License

MIT
