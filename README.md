# MediaTracker-AI

A modern, cloud-ready MEAN stack application for tracking, rating, and discovering media collections (games, movies, music). Features AI-powered recommendations, external metadata aggregation, and a responsive Material Design UI with accessibility support.

## Overview

MediaTracker-AI is a full-stack media collection tracker that helps users:
- **Organize** games, movies, and audio content with rich metadata
- **Rate & Review** items with per-item interaction tracking
- **Discover** personalized recommendations based on ratings and preferences
- **Customize** theme (light/dark/colorblind) and UI preferences
- **Enrich** collection with external data from OMDb, TMDB, and other providers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 16 + Angular Material + Sass |
| **Backend** | Node.js (Express.js) with TypeScript |
| **Database** | MongoDB 6.x |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Deployment** | Single Docker image (Render/AWS-compatible) |

## Architecture

The application uses a **single-container microservices architecture**:

```
┌─────────────────────────────────────────────────────────┐
│  MediaTracker Container (Node.js + Nginx)              │
├─────────────────────────────────────────────────────────┤
│  Frontend (Angular + Nginx)                    :80      │
│  ├─ /                 - SPA served on 80               │
│  └─ /api/*            - Routed to API Gateway          │
│                                                         │
│  API Gateway (Express)                         :3000    │
│  ├─ /media            - Routes to Media Service        │
│  ├─ /recommendations  - Routes to Recommendation       │
│  └─ /preferences      - Routes to Preferences          │
│                                                         │
│  Media Service (Express)                       :4000    │
│  ├─ CRUD operations for media items                   │
│  ├─ External metadata aggregation (OMDb/TMDB)        │
│  └─ Rating & interaction tracking                     │
│                                                         │
│  Recommendation Service (Express)               :4100    │
│  ├─ Content-based filtering                           │
│  ├─ Tag & category matching                           │
│  └─ Favorite boost weighting                          │
│                                                         │
│  Preferences Service (Express)                 :4200    │
│  └─ User theme & UI settings persistence              │
│                                                         │
│  MongoDB (External/Docker)                     :27017   │
│  └─ Persistent data storage                           │
└─────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Docker & Docker Compose (or Node.js 18+ and MongoDB for local development)
- API keys (optional): [OMDb](http://www.omdbapi.com/apikey.aspx), [TMDB](https://www.themoviedb.org/settings/api)

### With Docker (Recommended)

```bash
# Clone and navigate
git clone <repo-url>
cd mediatracker-ai

# Copy and configure environment
cp .env.example .env

# Start the stack
docker compose up --build
```

The app will be available at:
- **Frontend**: http://localhost
- **API Gateway**: http://localhost:3000
- **Mongo Express**: http://localhost:8081 (if enabled)

### Local Development (Without Docker)

```bash
# Install MongoDB (locally or use MongoDB Atlas)
# Set MONGO_URI in .env

# Install frontend dependencies
cd frontend
npm ci

# In separate terminals, start each service:
# Terminal 1: Media Service
cd services/media-service && npm i && npm run dev

# Terminal 2: Recommendation Service
cd services/recommendation-service && npm i && npm run dev

# Terminal 3: Preferences Service
cd services/preferences-service && npm i && npm run dev

# Terminal 4: API Gateway
cd services/api-gateway && npm i && npm run dev

# Terminal 5: Frontend (Angular dev server)
cd frontend && npm start
```

Frontend will be at http://localhost:4200

## Project Structure

```
mediatracker-ai/
├── frontend/                      # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/             # Services (API, Theme, Auth)
│   │   │   ├── shared/           # Rating widget, common components
│   │   │   ├── media/            # Media list and detail templates
│   │   │   ├── recommendations/  # Recommendation cards
│   │   │   └── settings/         # Theme and preference controls
│   │   ├── styles/               # Global styles, themes
│   │   ├── environments/         # Environment configs
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
├── services/
│   ├── api-gateway/              # Express proxy, port 3000
│   │   └── src/
│   │       └── index.ts          # http-proxy-middleware setup
│   │
│   ├── media-service/            # Media CRUD + metadata, port 4000
│   │   └── src/
│   │       ├── controllers/      # HTTP handlers
│   │       ├── services/         # Business logic (external-metadata.service.ts)
│   │       ├── models/           # Mongoose schemas
│   │       ├── routes/           # Express routes
│   │       └── index.ts
│   │
│   ├── recommendation-service/   # Content-based filtering, port 4100
│   │   └── src/
│   │       ├── controllers/      # Recommendation endpoints
│   │       └── index.ts
│   │
│   └── preferences-service/      # User settings, port 4200
│       └── src/
│           ├── controllers/      # Theme/settings endpoints
│           ├── models/           # Preferences schema
│           └── index.ts
│
├── docker/
│   ├── entrypoint.sh             # Multi-service orchestration
│   └── nginx.conf                # Static frontend + API routing
│
├── Dockerfile                     # 3-stage build (services + frontend + runtime)
├── docker-compose.yml            # Mongo + MediaTracker container
├── .env.example                  # Environment variable template
└── README.md
```

## Features

### Media Management
- **CRUD Operations**: Create, read, update, delete media items
- **Multi-Type Support**: Games, movies, audio (with category-specific fields)
- **Rich Metadata**: Title, category, tags, acquisition date, price, notes
- **Rating System**: 1-10 per-item rating with favorite flag

### External Data Integration
- **OMDb API**: Movie/TV metadata (title, synopsis, cast, ratings)
- **TMDB API**: Enhanced movie details (genres, release date, runtime)
- **Caching**: Metadata cached in database, refresh on-demand
- **Fallback**: Graceful degradation if APIs unavailable

### Recommendations
- **Content-Based Filtering**: Scores items by tag overlap, category match, platform
- **Weighted Scoring**: Configurable weights (tag: 2, category: 1.2, platform: 1.1, favorite: +2)
- **Three Endpoints**:
  - `GET /recommendations` - Global recommendations
  - `GET /recommendations/media/:id` - Similar to specific item
  - `GET /recommendations/category/:category` - Within category

### UI & Themes
- **Material Design**: Angular Material components (Cards, Toolbar, Sidenav, Forms)
- **Three Themes**:
  - **Light**: White background, dark text
  - **Dark**: #0f1720 background, light text  
  - **Colorblind**: Deuteranopia-safe colors (#102a43 text)
- **Responsive Layout**: Mobile-friendly Sidenav navigation
- **Accessibility**: Semantic HTML, ARIA labels, high-contrast text

## Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
# MongoDB
MONGO_URI=mongodb://mongo:27017/mediatracker

# External APIs (optional, for metadata enrichment)
OMDB_API_KEY=your_omdb_key_here
TMDB_API_KEY=your_tmdb_key_here

# Frontend (API base URL)
FRONTEND_API_BASE=http://localhost:3000

# Services
MEDIA_SERVICE_URL=http://localhost:4000
RECOMMENDATION_SERVICE_URL=http://localhost:4100
PREFERENCES_SERVICE_URL=http://localhost:4200
```

### Ports

| Service | Port | Purpose |
|---------|------|---------|
| Nginx (Frontend) | 80 | SPA and static files |
| API Gateway | 3000 | Request routing to microservices |
| Media Service | 4000 | Media CRUD and metadata |
| Recommendation Service | 4100 | Recommendations engine |
| Preferences Service | 4200 | User settings |
| MongoDB | 27017 | Database |
| Mongo Express (optional) | 8081 | MongoDB GUI |

## API Endpoints

### Media Service (`/media`)

```
GET    /media              - List all media
GET    /media/:id          - Get media item
POST   /media              - Create new media
PUT    /media/:id          - Update media
DELETE /media/:id          - Delete media

PATCH  /media/:id/rating   - Rate/favorite item
GET    /media/:id/external - Get cached metadata (fetch on-demand)
POST   /media/:id/external/refresh - Force refresh metadata
```

### Recommendations Service (`/recommendations`)

```
GET    /recommendations            - Global recommendations
GET    /recommendations/media/:id  - Similar items
GET    /recommendations/category/:category - Category-based
```

### Preferences Service (`/preferences`)

```
GET    /preferences/user/:userId   - Get user preferences
PUT    /preferences/user/:userId   - Update preferences
```

## Deployment

### Deploy Directly from Git (Docker Compose)

Use this `docker-compose.yml` to build and run directly from the GitHub repository:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6
    container_name: mediatracker-mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: mediatracker
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  mediatracker:
    build:
      context: https://github.com/your-username/mediatracker-ai.git#main
      dockerfile: Dockerfile
    container_name: mediatracker-app
    ports:
      - '80:80'
      - '3000:3000'
      - '4000:4000'
      - '4100:4100'
      - '4200:4200'
    environment:
      MONGO_URI: mongodb://mongo:27017/mediatracker
      OMDB_API_KEY: ${OMDB_API_KEY}
      TMDB_API_KEY: ${TMDB_API_KEY}
    depends_on:
      mongo:
        condition: service_healthy
    restart: unless-stopped

  mongo-express:
    image: mongo-express:latest
    container_name: mediatracker-mongo-express
    ports:
      - '8081:8081'
    environment:
      ME_CONFIG_MONGODB_URL: mongodb://mongo:27017
    depends_on:
      - mongo

volumes:
  mongo_data:
```

**Usage**:

```bash
# Clone repo or create .env file
cat > .env << EOF
OMDB_API_KEY=your_omdb_key
TMDB_API_KEY=your_tmdb_key
EOF

# Build from git and start
docker compose up --build

# App available at http://localhost
```

### Pre-built Docker Image (From Registry)

For faster deployment, use a pre-built image from Docker Hub or your registry:

```yaml
version: '3.8'

services:
  mongo:
    image: mongo:6
    container_name: mediatracker-mongo
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: mediatracker

  mediatracker:
    image: your-registry/mediatracker:latest
    container_name: mediatracker-app
    ports:
      - '80:80'
      - '3000:3000'
    environment:
      MONGO_URI: mongodb://mongo:27017/mediatracker
      OMDB_API_KEY: ${OMDB_API_KEY}
      TMDB_API_KEY: ${TMDB_API_KEY}
    depends_on:
      - mongo
    restart: unless-stopped

volumes:
  mongo_data:
```

**Usage**:

```bash
# Pull and run pre-built image
docker compose up

# To build and push your own image:
docker build -t your-registry/mediatracker:latest .
docker push your-registry/mediatracker:latest
```

### Deploy to Render (Recommended)

1. **Create Render Service**:
   - Use `Docker Image` deploy option
   - Point to this GitHub repo
   - Set `MONGO_URI` to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

2. **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mediatracker
   OMDB_API_KEY=your_key
   TMDB_API_KEY=your_key
   ```

3. **Deploy**:
   - Push to `main` branch
   - Render auto-builds and deploys single Docker image

### Deploy to AWS/GCP/DigitalOcean

```bash
# Build and push to registry
docker build -t your-registry/mediatracker:latest .
docker push your-registry/mediatracker:latest

# Deploy image with Docker or Kubernetes
# Ensure MONGO_URI env var points to production MongoDB
```

## Development

### Adding a New Microservice

1. Create folder: `services/new-service/`
2. Setup package.json and Express app
3. Add routes to `api-gateway/index.ts`
4. Update `docker/entrypoint.sh` to start service
5. Add port mapping to `docker-compose.yml`

### Local Testing

```bash
# Build Docker image locally
docker build -t mediatracker:dev .

# Run container with local MongoDB
docker run -p 80:80 -p 3000:3000 -e MONGO_URI=mongodb://host.docker.internal:27017 mediatracker:dev

# Test endpoints
curl http://localhost/
curl http://localhost:3000/media
```

### Unit Testing

```bash
# Frontend
cd frontend && npm run test

# Services (to be implemented)
cd services/media-service && npm run test
```

## Future Enhancements

- [ ] **JWT Authentication**: Multi-user support with per-user data scoping
- [ ] **Advanced Recommendations**: Embeddings-based similarity using vector DB (Pinecone/Weaviate)
- [ ] **Mobile App**: React Native or Flutter counterpart
- [ ] **Social Features**: User profiles, collection sharing, ratings visibility
- [ ] **Search & Filtering**: Full-text search, faceted filtering by tag/price/date
- [ ] **Batch Import**: CSV/Excel import for existing collections
- [ ] **Analytics**: User metrics, collection stats, recommendation accuracy tracking

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `docker compose up` fails | Ensure Docker Desktop is running; check `docker --version` |
| MongoDB connection error | Verify `MONGO_URI` in `.env`; check MongoDB is running on `127.0.0.1:27017` |
| Frontend shows blank page | Check browser console (F12) for CORS/API errors; ensure API Gateway is running on :3000 |
| External metadata not loading | Verify API keys in `.env`; check rate limits on OMDb/TMDB |
| Port already in use | Kill process: `lsof -i :80` (Mac/Linux) or `netstat -ano` (Windows) |

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push and open Pull Request

## License

MIT

## Contact & Support

For questions or issues, open a GitHub issue or contact the maintainers.

---

**Last Updated**: February 2026  
**Status**: Production Ready (Docker deployment validated)

