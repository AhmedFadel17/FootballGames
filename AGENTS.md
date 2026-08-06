# AGENTS.md — FootballGames Project Guide for AI Agents

> This file provides everything an AI agent needs to understand, run, and contribute to the **FootballGames** project without reading every source file.

---

## 1. Project Overview

**FootballGames** is a full-stack web application for football-themed games (Bingo, Top List, Guess The Player). It ships a **Laravel 12 API** backend + **React 18 / TypeScript** frontend connected via **Inertia.js**, with real-time features powered by **Laravel Reverb** (WebSockets) and **Redis**.

| Layer | Technology |
|---|---|
| Backend | PHP 8.2+, Laravel 12, Sanctum (auth), Reverb (WebSocket) |
| Frontend | React 18, TypeScript 5.8, Vite 7, Tailwind CSS 3.2, Inertia.js |
| Database | PostgreSQL 17 (via Sail) |
| Cache / Queue | Redis (via Sail) |
| Dev environment | Laravel Sail (Docker Compose) |
| Mail (dev) | Mailpit |
| State management | Redux Toolkit |
| Forms | React Hook Form + Yup |
| Animations | Framer Motion |
| Testing | Pest PHP |

---

## 2. Directory Structure

```
FootballGames/
├── app/
│   ├── DTOs/               # Request/Response Data Transfer Objects
│   ├── Enums/              # PHP enums (roles, etc.)
│   ├── Events/             # Laravel events (broadcast)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── Core/       # CRUD controllers for football entities
│   │   │   ├── Game/       # GameController, GameInstanceController, GameResultController
│   │   │   └── GamesList/  # Bingo/, TopList/, GuessThePlayerController
│   │   ├── Middleware/     # role middleware, etc.
│   │   └── Requests/       # Form request validators
│   ├── Listeners/          # Event listeners
│   ├── Models/
│   │   ├── Core/           # Competition, CompetitionSeason, Continent, Country, Manager,
│   │   │                   # ManagerTeamPeriod, Player, PlayerCareerSummary, PlayerSeasonStat,
│   │   │                   # PlayerTeamPeriod, Season, Standing, Team, Transfer
│   │   ├── Game/           # Game, GameInstance, GameEntry, GameResult, GamePrize
│   │   ├── GamesList/      # BingoGame, BingoMatch, BingoCondition,
│   │   │                   # TopListGame, TopListItem, TopListAnswer,
│   │   │                   # GuessThePlayerGame, GuessThePlayerAssignment
│   │   ├── User.php
│   │   └── UserSetting.php
│   ├── Resources/          # Laravel API Resources (JSON transformers)
│   ├── Services/           # Business logic, one sub-folder per domain
│   │   ├── Competition/, Country/, Player/, Team/, Season/, Transfer/,
│   │   │   Manager/, Continent/, ManagerTeamPeriod/, PlayerTeamPeriod/
│   │   ├── GameServices/, GamesListServices/, CompetitionParticipant/,
│   │   │   CompetitionPlayerFullStat/, CompetitionTeamFullStat/
│   │   ├── CoreServices/   # Shared service helpers
│   │   ├── Pagination/     # Pagination helpers
│   │   └── Users/
│   ├── Shared/             # Shared utilities / base classes
│   └── Providers/
├── database/
│   ├── migrations/         # 55 migrations (see section 6 for schema overview)
│   └── seeders/            # See section 7 for seed order
├── resources/
│   ├── js/                 # React frontend
│   │   ├── components/     # Reusable UI components (GenericTable, modals, etc.)
│   │   ├── pages/          # Page-level React components (admin, games, auth)
│   │   ├── store/          # Redux store + slices
│   │   └── types/          # TypeScript types (models/, shared/)
│   └── views/              # Blade root template (app.blade.php)
├── routes/
│   ├── api.php             # All REST API routes (see section 5)
│   ├── auth.php            # Inertia auth routes (login/register pages)
│   ├── web.php             # Inertia SPA catch-all
│   └── channels.php        # Broadcast channel auth
├── tests/                  # Pest test suites
├── docker-compose.yml      # Laravel Sail services
├── .env                    # Local env (never commit secrets)
├── .env.example            # Template — copy to .env
├── AGENTS.md               # <- this file
├── CLAUDE.md               # AI coding behavioural guidelines
└── IMPLEMENTATION_SUMMARY.md  # Admin table implementation notes
```

---

## 3. Environment Setup (Docker / Sail — Recommended)

### Prerequisites
- Docker Desktop running (Windows: WSL2 backend recommended)
- No local PHP/Node required when using Sail

### First-Time Setup

```bash
# 1. Copy env and fill in values
cp .env.example .env

# 2. Install PHP deps (requires local PHP, or use the sail helper)
composer install

# 3. Start all Docker services (Postgres, Redis, Mailpit + app)
docker compose up -d --build
# OR using the Sail alias:
./vendor/bin/sail up -d

# 4. Run DB migrations + seeders
./vendor/bin/sail artisan migrate:fresh --seed

# 5. Install Node deps and start Vite dev server
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

### Windows-Specific Notes

> **Important for Windows developers:**
> Laravel Sail requires `WWWUSER` and `WWWGROUP` to be set. On Linux these are auto-detected from
> the shell; on Windows they are NOT. The `.env` file (and `.env.example`) already includes:
>
> ```
> WWWUSER=1000
> WWWGROUP=1000
> ```
>
> The `docker-compose.yml` also uses `:-1000` fallback defaults so the build will not fail even
> if these are missing from your shell environment.

### Without Docker (Local Dev)

```bash
# Requires: PHP 8.2+, Composer, Node 18+, PostgreSQL 17, Redis
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
composer run dev   # starts artisan serve + queue:listen + npm run dev concurrently
```

### Useful Sail / Artisan Commands

```bash
# Run all tests
./vendor/bin/sail artisan test

# Fresh DB with seeds
./vendor/bin/sail artisan migrate:fresh --seed

# PHP code formatting
./vendor/bin/pint

# Open Tinker REPL
./vendor/bin/sail artisan tinker

# View application logs (real-time)
./vendor/bin/sail artisan pail

# Queue worker
./vendor/bin/sail artisan queue:work
```

---

## 4. Key Environment Variables

| Variable | Example | Purpose |
|---|---|---|
| `APP_URL` | `http://localhost:8000` | Base URL |
| `APP_KEY` | `base64:...` | Laravel encryption key |
| `DB_CONNECTION` | `pgsql` | Must be `pgsql` |
| `DB_HOST` | `pgsql` | Docker service name (or `127.0.0.1` locally) |
| `DB_DATABASE` | `footballGamesDB` | Postgres database name |
| `DB_USERNAME` | `postgres` | |
| `DB_PASSWORD` | `password` | |
| `REDIS_HOST` | `redis` | Docker service name (or `127.0.0.1` locally) |
| `REDIS_CLIENT` | `predis` | Must be `predis` (not `phpredis`) |
| `SESSION_DRIVER` | `redis` | |
| `QUEUE_CONNECTION` | `redis` | |
| `CACHE_STORE` | `redis` | |
| `BROADCAST_CONNECTION` | `reverb` | WebSocket server |
| `REVERB_HOST` | `localhost` | |
| `REVERB_PORT` | `8080` | |
| `WWWUSER` | `1000` | **Windows required** — Sail container user ID |
| `WWWGROUP` | `1000` | **Windows required** — Sail container group ID |

---

## 5. API Route Structure

Base: `/api/`

### Public Auth Routes (`/api/auth/`)
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns Sanctum token |
| POST | `/auth/refresh` | Refresh token rotation |
| POST | `/auth/guest` | Guest login |

### Authenticated Routes (require `auth:sanctum`)

#### Auth (`/api/auth/`)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/auth/logout` | any | Logout |
| GET | `/auth/me` | any | Current user |

#### User Routes (`/api/v1/u/`) — roles: `user`, `guest`
- `GET /u/games` — list available games
- `GET /u/players` — list players
- `GET /u/countries` — list countries
- `GET /u/teams` — list teams
- Room actions: `/u/rooms/{id}/leave`, `/u/rooms/{id}/result`
- Bingo gameplay: `/u/games-list/bingo/{id}/conditions|next-match|skip|check|results|cancel`
- Top List gameplay: `/u/games-list/top-list` CRUD + `start|cancel|results|check`
- Guess The Player: `/u/games-list/guess-the-player/instance|game|create|join|join-with-code|submit|ask`

#### Admin Routes (`/api/v1/admin/`) — role: `admin`
Full `apiResource` (index, show, store, update, destroy) for:
- `competitions`, `competition-participants`, `competition-player-stats`, `competition-team-stats`
- `continents`, `countries`
- `managers`, `manager-team-periods`
- `players`, `player-team-periods`
- `seasons`, `teams`, `transfers`
- `games`, `games-list/top-list`
- Option endpoints: `/admin/options/{countries|players|teams|competitions}`

### Web Routes (Inertia)
All pages rendered server-side via Inertia.js. See `routes/web.php` and `routes/auth.php`.

---

## 6. Database Schema Overview

### Core Football Data
| Table | Key Columns |
|---|---|
| `continents` | id, name, code |
| `countries` | id, name, code, continent_id, popularity |
| `competitions` | id, name, short_name, country_id, type, tier, founded_year, popularity, is_active |
| `seasons` | id, name, start_year, end_year |
| `competition_seasons` | id, competition_id, season_id |
| `teams` | id, name, short_name, abbreviation, country_id, image_src, popularity |
| `players` | id, name, full_name, position, date_of_birth, country_id, image_src, popularity |
| `managers` | id, name, nationality, birth_date |
| `standings` | id, competition_season_id, team_id, points, wins, draws, losses, position |
| `transfers` | id, player_id, from_team_id, to_team_id, transfer_date, fee, loan |
| `player_team_periods` | id, player_id, team_id, start_date, end_date |
| `manager_team_periods` | id, manager_id, team_id, start_date, end_date |
| `player_season_stats` | id, player_id, competition_season_id, goals, assists, appearances, ... |
| `player_career_summaries` | id, player_id, total_goals, total_assists, ... |
| `competition_player_stats` | id, player_id, competition_id, season stats |
| `competition_team_stats` | id, team_id, competition_id, season stats |

### Users & Auth
| Table | Key Columns |
|---|---|
| `users` | id, name, email, username, role (admin/user), refresh_token |
| `user_settings` | id, user_id, preferences JSON |
| `personal_access_tokens` | Sanctum tokens |

### Games System
| Table | Purpose |
|---|---|
| `games` | Game definition (name, type, config JSON) |
| `game_instances` | Individual game sessions with room_code |
| `game_entries` | User participation per instance |
| `game_results` | Scores per instance/user |
| `bingo_games` | Bingo-specific grid config |
| `bingo_matches` | Match events within a bingo game |
| `bingo_conditions` | Condition definitions per game |
| `top_list_games` | Top-list config (item_type, list) |
| `top_list_items` | Items in a top list |
| `top_list_answers` | User answers per entry |
| `guess_the_player_games` | Guess-the-player round config |
| `guess_the_player_game_assignments` | Player assignments per instance |

---

## 7. Database Seeding

Seeders must run in dependency order. The `DatabaseSeeder` currently runs:

```
1.  ContinentSeeder           — base table, no dependencies
2.  CountriesTableSeeder      — depends on: continents
3.  CompetitionsSeeder        — depends on: countries
4.  SeasonSeeder              — independent
5.  TeamSeeder                — depends on: countries
6.  StandingsSeeder           — depends on: competition_seasons, teams
7.  PlayersSeeder             — depends on: countries
8.  ManagersSeeder            — independent
9.  TransfersSeeder           — depends on: players, teams
10. PlayerCareersSeeder       — depends on: players, teams, seasons, competitions
```

Commented-out (currently disabled):
- `TeamFullStatsSeeder`, `CompetitionParticipantsSeeder`, `CompetitionPlayerFullStatsSeeder`
- `GameTypesTableSeeder`, `GamesTableSeeder`, `AdminSeeder`

---

## 8. Authentication System

- **Laravel Sanctum** token-based authentication
- **Roles**: `admin` | `user` | `guest`
- **Role middleware**: applied as `role:admin` or `role:user,guest` per route group
- **Refresh tokens**: stored in `users.refresh_token`; rotated on each refresh call
- Frontend stores the access token in Redux; refresh token in an HttpOnly cookie

---

## 9. Common Patterns & Conventions

### Service Layer
Every domain has a `Services/{Domain}/` directory. Services contain all business logic. Controllers are thin — they call the service and return the response.

### DTOs
- **Request DTOs**: Validate and transfer input data from `FormRequest` to the service.
- **Response DTOs**: Transform model data (with relationships) into a consistent JSON shape.

### Relationship Loading
Services use `->with('relation')` in queries and `->load('relation')` after individual operations so relationships are always included in DTO responses.

### GenericTable (Frontend)
The admin dashboard uses a single `<GenericTable>` React component for all CRUD tables. Each page defines its columns and field definitions; the component handles add/edit/delete modals, pagination, and search.

### API Response Format
Standard Laravel JSON responses. Validation errors return HTTP 422 in Laravel's default shape.

---

## 10. Development Services & Ports

When running via Sail (`docker compose up`):

| Service | Local Port | Purpose |
|---|---|---|
| App (Laravel) | 80 | HTTP |
| Vite (HMR) | 5173 | Frontend dev server |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache / Queue / Sessions |
| Mailpit UI | 8025 | View captured dev emails |
| Mailpit SMTP | 1025 | SMTP endpoint for app |
| Reverb (WebSocket) | 8080 | Real-time broadcast |

---

## 11. Testing

```bash
# Run all Pest tests
composer test
# or
./vendor/bin/sail artisan test

# Filter to a specific test
./vendor/bin/sail artisan test --filter=Auth
```

Tests live in `tests/Feature/` and `tests/Unit/`. The framework is **Pest** (functional wrapper over PHPUnit).

---

## 12. Gotchas & Known Issues

1. **Windows + Sail**: `WWWUSER` and `WWWGROUP` must be set in `.env` (value `1000`). Linux auto-detects these from the shell; Windows does not.
2. **`predis` not `phpredis`**: The Sail PHP runtime does not include the `phpredis` extension. Always use `REDIS_CLIENT=predis`.
3. **DB host inside Docker**: Use `DB_HOST=pgsql` and `REDIS_HOST=redis` (Docker Compose service names). For local dev without Docker use `127.0.0.1`.
4. **Seeder order matters**: Foreign-key constraints enforce the order listed in section 7.
5. **Sanctum + Inertia**: The project uses Inertia for page rendering but Sanctum tokens (not session cookies) for API auth. Web routes go through Inertia; API routes use token auth.
6. **Reverb port**: The WebSocket server runs on port 8080. Ensure `REVERB_PORT=8080` and that port is open on your machine.
