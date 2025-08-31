# ⚽ Football Games - Interactive Football Gaming Platform

A modern, full-stack web application built with Laravel and React that provides an engaging football gaming experience with comprehensive admin management capabilities.

## 🚀 Features

### 🎮 Interactive Games
- **Bingo Game**: Dynamic football bingo with customizable grids and real-time gameplay
- **Top List Game**: Interactive top 10 ranking challenges with multiple attempts
- **Game Management**: Comprehensive game instance and entry tracking system

### 🏆 Football Data Management
- **Core Entities**: Teams, Players, Competitions, Countries, Continents, Seasons, Managers, Transfers
- **Statistics**: Detailed player and team performance metrics across competitions
- **Relationships**: Sophisticated data relationships with proper foreign key constraints

### 👥 User Management
- **Role-Based Access**: Admin and User roles with different permission levels
- **User Profiles**: Comprehensive user settings and gaming statistics
- **Authentication**: Secure login/signup with JWT tokens and refresh token support

### 🎯 Admin Dashboard
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for all entities
- **Data Tables**: Responsive, searchable tables with pagination and sorting
- **Relationship Handling**: Intelligent foreign key resolution and display
- **Real-time Updates**: Dynamic form generation and validation

## 🛠️ Technology Stack

### Backend
- **PHP 8.2+** with **Laravel 12.0**
- **MySQL/PostgreSQL** database with Eloquent ORM
- **Laravel Sanctum** for API authentication
- **Inertia.js** for seamless SPA experience
- **Pest** for testing framework

### Frontend
- **React 18** with **TypeScript 5.8**
- **Tailwind CSS 3.2** for modern, responsive design
- **Vite 7.0** for fast development and building
- **Redux Toolkit** for state management
- **React Hook Form** with **Yup** validation
- **Framer Motion** for smooth animations

### Development Tools
- **Laravel Pint** for PHP code styling
- **Laravel Sail** for Docker development environment
- **Concurrently** for running multiple development servers

## 📁 Project Structure

```
FootballGames/
├── app/                          # Laravel application logic
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Http/                    # Controllers, Middleware, Requests
│   ├── Models/                  # Eloquent models
│   ├── Services/                # Business logic services
│   └── Providers/               # Service providers
├── database/                     # Database migrations and seeders
├── resources/                    # Frontend assets
│   ├── js/                      # React components and logic
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── types/               # TypeScript type definitions
│   │   └── store/               # Redux store configuration
│   └── views/                   # Blade templates
├── routes/                       # API and web routes
└── tests/                       # Test files
```

## 🎯 Core Features Breakdown

### Football Data Management
- **Teams**: Name, abbreviation, country association, images
- **Players**: Position, nationality, birth date, popularity metrics
- **Competitions**: League types, country associations, tier system
- **Statistics**: Comprehensive player and team performance tracking
- **Geographic**: Continent and country management with proper relationships

### Gaming System
- **Game Types**: Configurable game categories and rules
- **Game Instances**: Individual game sessions with unique configurations
- **Player Entries**: User participation tracking and results
- **Scoring System**: Comprehensive result tracking and validation

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching with persistent preferences
- **Real-time Updates**: Dynamic content updates without page refresh
- **Accessibility**: WCAG compliant components and navigation

## 🚀 Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer 2.0 or higher
- Node.js 18.0 or higher
- MySQL 8.0 or PostgreSQL 13 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FootballGames
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database configuration**
   ```bash
   # Update .env with your database credentials
   php artisan migrate
   php artisan db:seed
   ```

6. **Start development servers**
   ```bash
   # Option 1: Use Laravel Sail (Docker)
   ./vendor/bin/sail up
   
   # Option 2: Use composer script
   composer run dev
   
   # Option 3: Manual start
   php artisan serve
   npm run dev
   ```

### Development Commands

```bash
# Run tests
composer test

# Code formatting
./vendor/bin/pint

# Database operations
php artisan migrate:fresh --seed

# Frontend build
npm run build
```

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full access to all features and data management
- **User**: Access to games and personal profile

### Security Features
- JWT token-based authentication
- Refresh token rotation
- Role-based middleware protection
- CSRF protection
- Input validation and sanitization

## 🎮 Game Types

### Bingo Game
- Customizable grid sizes (3x3, 4x4, 5x5)
- Dynamic condition generation
- Real-time game state management
- Multiple player support

### Top List Game
- Configurable item types (players, teams, etc.)
- Multiple attempt system
- Progressive difficulty
- Score tracking and leaderboards

## 📊 Admin Dashboard Features

### Data Management
- **Generic Table Component**: Consistent CRUD operations across all entities
- **Relationship Handling**: Intelligent foreign key resolution
- **Dynamic Forms**: Auto-generated forms based on entity structure
- **Search & Filter**: Advanced data filtering and search capabilities
- **Bulk Operations**: Mass update and delete functionality

### Monitoring & Analytics
- User activity tracking
- Game performance metrics
- System health monitoring
- Error logging and reporting

## 🧪 Testing

The project uses Pest PHP testing framework with comprehensive test coverage:

```bash
# Run all tests
composer test

# Run specific test suites
php artisan test --filter=Auth
php artisan test --filter=Game
```

## 📈 Performance & Optimization

- **Laravel Caching**: Redis/Memcached support for improved performance
- **Database Optimization**: Proper indexing and relationship loading
- **Frontend Optimization**: Code splitting and lazy loading
- **Asset Optimization**: Vite-based bundling and compression

## 🔧 Configuration

### Environment Variables
Key configuration options in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=football_games
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
```

### Customization
- Game rules and scoring systems
- UI themes and branding
- Database schema modifications
- API rate limiting and throttling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow PSR-12 coding standards
- Use Laravel Pint for PHP formatting
- Maintain TypeScript strict mode
- Write comprehensive tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` folder
- Review the implementation summary in `IMPLEMENTATION_SUMMARY.md`

## 🔮 Roadmap

### Planned Features
- [ ] Real-time multiplayer gaming
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] API rate limiting and monitoring
- [ ] Advanced game customization options
- [ ] Social features and leaderboards

### Performance Improvements
- [ ] Database query optimization
- [ ] Caching strategy implementation
- [ ] CDN integration for assets
- [ ] Progressive Web App (PWA) features

---

**Built with ❤️ using Laravel and React**

*This project demonstrates modern web development practices with a focus on user experience, performance, and maintainability.*
