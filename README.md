# 🎨 Artify - Online Art Marketplace

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.2+-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack online art marketplace where artists can showcase and sell their artwork while buyers can discover and purchase unique pieces. Built with Django REST Framework backend and React frontend.

## 🌟 Features

### For Artists
- 🎯 **Portfolio Management**: Create and manage artwork portfolios with multi-image uploads
- 📊 **Sales Dashboard**: Track sales, earnings, and comprehensive analytics  
- 🏆 **Artist Verification**: Verified artist badges and enhanced profiles
- 💰 **Pricing Control**: Set and modify artwork prices with dynamic availability
- 📸 **Multiple Images**: Upload multiple high-quality images per artwork

### For Buyers
- 🔍 **Advanced Search**: Search by artist, medium, price range, category and more
- 📚 **Collections**: Create personal artwork collections and wishlists
- ⭐ **Reviews & Ratings**: Rate and review purchased artworks
- 💳 **Secure Payments**: Stripe integration for secure transactions
- 🛒 **Shopping Cart**: Seamless shopping experience with order tracking

### Platform Features
- 🔐 **User Authentication**: JWT-based secure authentication system
- 🔔 **Real-time Notifications**: In-app and email notifications
- 📱 **Responsive Design**: Mobile-first responsive UI
- 📚 **API Documentation**: Comprehensive REST API with Swagger UI
- 📈 **Admin Dashboard**: Full admin control panel for platform management
- ⚡ **Performance Optimized**: Redis caching and database optimization

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Django Backend │    │   PostgreSQL    │
│                 │────│                 │────│    Database     │
│  - Components   │    │  - REST API     │    │                 │
│  - State Mgmt   │    │  - Models       │    │  - User Data    │
│  - Routing      │    │  - Views        │    │  - Artworks     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │      Redis      │             │
         └──────────────│     Cache       │─────────────┘
                        │  - Sessions     │
                        │  - Notifications│
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+ (or SQLite for development)
- Redis 7+ (optional, for caching)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Rishabh0411/Artify.git
cd Artify
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
# Edit .env file with your configuration

# Database setup
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py create_sample_data

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 📁 Project Structure

```
Artify/
├── backend/
│   ├── art_marketplace/          # Django project settings
│   ├── core/                     # User management & core models
│   ├── artworks/                 # Artwork management
│   ├── orders/                   # Shopping cart & orders
│   ├── notification_system/      # Notification management
│   ├── media/                    # User uploaded files
│   ├── static/                   # Static files
│   ├── requirements.txt
│   ├── manage.py
│   └── deploy.sh                 # Deployment script
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Authentication
│   │   │   ├── artist/          # Artist dashboard
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── orders/          # Order management
│   │   │   └── shop/            # Product browsing
│   │   ├── services/            # API services
│   │   ├── assets/              # Static assets
│   │   └── App.jsx              # Main App component
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 📋 Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/artify

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Frontend Configuration

Update `frontend/src/services/apiService.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';  // Development
// const API_BASE_URL = 'https://your-domain.com/api';  // Production
```

## 🔒 Authentication & Authorization

### User Types
- **Buyers**: Can browse, purchase, and review artworks
- **Artists**: Can list artworks + all buyer permissions
- **Admin**: Full platform management access

### API Authentication
- JWT-based authentication using Django REST Framework Simple JWT
- Tokens are stored in localStorage on the frontend
- Protected routes require valid authentication tokens

### Sample Accounts (after running `create_sample_data`)
```
Artist Account:
- Email: lena.petrova@example.com
- Password: samplepassword123

Buyer Account:
- Email: buyer@example.com  
- Password: samplepassword123
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests (if implemented)
cd frontend
npm run test
```

### Code Quality
```bash
# Backend linting and formatting
cd backend
flake8 .
black .

# Frontend linting
cd frontend
npm run lint
```

### Database Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## � API Documentation

### Main Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PATCH /api/auth/profile/` - Update user profile

#### Artworks
- `GET /api/artworks/` - List artworks (with filtering)
- `POST /api/artworks/create/` - Create artwork (artists only)
- `GET /api/artworks/{id}/` - Get artwork details
- `PATCH /api/artworks/{id}/update/` - Update artwork (owner only)
- `DELETE /api/artworks/{id}/delete/` - Delete artwork (owner only)
- `POST /api/artworks/{id}/like/` - Like/unlike artwork

#### Shopping Cart
- `GET /api/orders/cart/` - Get user's cart
- `POST /api/orders/cart/add/` - Add item to cart
- `DELETE /api/orders/cart/remove/{artwork_id}/` - Remove from cart

#### Orders
- `GET /api/orders/orders/` - List user's orders
- `POST /api/orders/orders/create/` - Create new order
- `GET /api/orders/orders/{id}/` - Get order details

### Sample API Requests

```bash
# Register user
POST /api/auth/register/
{
  "username": "artist1",
  "email": "artist@example.com",
  "password": "secure_password",
  "user_type": "artist"
}

# Login
POST /api/auth/login/
{
  "email": "artist@example.com",
  "password": "secure_password"
}

# Create artwork
POST /api/artworks/
{
  "title": "Beautiful Sunset",
  "description": "A stunning sunset painting",
  "price": "299.99",
  "medium": "Oil on Canvas"
}
```

Full API documentation available at: `/api/schema/swagger-ui/`

## � Deployment

### Using Docker (Recommended)
```bash
# Build and start services
docker-compose up -d --build

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

### Manual Deployment
1. **Server Setup**: Ubuntu 20.04+ with Python 3.11+
2. **Dependencies**: Install PostgreSQL, Redis, Nginx
3. **Application**: Use the provided `deploy.sh` script
4. **Web Server**: Configure Nginx with provided config
5. **SSL**: Set up SSL certificates (Let's Encrypt recommended)

### Environment-Specific Settings
- **Development**: DEBUG=True, SQLite database
- **Staging**: DEBUG=False, PostgreSQL, limited features
- **Production**: All security headers, HTTPS, full monitoring

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API endpoint rate limiting
- **CORS Configuration**: Properly configured CORS headers  
- **SQL Injection Protection**: Django ORM prevents SQL injection
- **XSS Protection**: Content Security Policy headers
- **HTTPS Enforcement**: SSL/TLS encryption in production
- **Input Validation**: Comprehensive input sanitization

## 🔧 Tech Stack

### Backend
- **Framework**: Django 5.2 + Django REST Framework
- **Database**: PostgreSQL 15 (SQLite for development)
- **Cache**: Redis 7
- **Authentication**: JWT tokens (djangorestframework-simplejwt)
- **File Storage**: Local/AWS S3 compatible
- **Payments**: Stripe integration

### Frontend  
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: CSS Modules
- **HTTP Client**: Fetch API

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Process Manager**: Gunicorn
- **Monitoring**: Built-in logging
- **CI/CD**: GitHub Actions ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation
- Use semantic commit messages
>>>>>>> b4166f32 (Finalized)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & FAQ

### Common Issues

**Q: I'm getting CORS errors**
A: Make sure your frontend URL is added to `CORS_ALLOWED_ORIGINS` in Django settings.

**Q: Images not loading**
A: Check that `MEDIA_URL` and `MEDIA_ROOT` are configured correctly and the media directory has proper permissions.

**Q: Payment processing fails**
A: The default implementation is a simulation. Integrate with a real payment gateway like Stripe for production.

### Getting Help

- � **Documentation**: [Wiki](https://github.com/Rishabh0411/Artify/wiki)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Rishabh0411/Artify/issues)
- � **Discussions**: [GitHub Discussions](https://github.com/Rishabh0411/Artify/discussions)
- 📧 **Email**: support@artify.com

## � Roadmap

### Version 2.0
- [ ] Mobile App (React Native)
- [ ] AI-powered artwork recommendations
- [ ] Virtual gallery tours
- [ ] Blockchain NFT integration
- [ ] Advanced analytics dashboard
- [ ] Social features (artist following, comments)
- [ ] Auction functionality

### Version 1.1 (Next Release)
- [ ] Multi-language support
- [ ] Advanced search with image similarity
- [ ] Bulk artwork upload
- [ ] Artist commission tracking
- [ ] Inventory management

## ⭐ Acknowledgments

- Django REST Framework community
- React.js team
- Lucide Icons for beautiful icons
- All the amazing artists who inspire creativity
- Contributors and testers
- Open source libraries used

---

**Made with ❤️ by [Rishabh](https://github.com/Rishabh0411)**

*Artify - Where Art Meets Technology* 🎨✨

*Star ⭐ this repository if you found it helpful!*
