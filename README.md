# 🎨 Artify - Art Marketplace E-commerce Platform

A modern, full-stack e-commerce platform specifically designed for artists to sell their artwork and art enthusiasts to discover and purchase unique pieces. Built with Django REST Framework and React.js.

## ✨ Features

### For Artists
- 🎯 **Artist Dashboard** - Manage your artwork portfolio
- 📸 **Multi-Image Upload** - Showcase your art with multiple high-quality images
- 💰 **Pricing Control** - Set your own prices and availability
- 📊 **Analytics** - Track views, likes, and earnings
- ✅ **Order Management** - Manage sales and track commissions
- 🏆 **Artist Verification** - Get verified artist status

### For Buyers
- 🔍 **Advanced Search & Filtering** - Find art by category, price, medium, and more
- ❤️ **Wishlist** - Save favorite artworks for later
- 🛒 **Shopping Cart** - Seamless shopping experience
- 💳 **Secure Checkout** - Multiple payment options with SSL encryption
- 📦 **Order Tracking** - Track your purchases from confirmation to delivery
- ⭐ **Reviews & Ratings** - Rate and review purchased artwork

### Platform Features
- 🔐 **Secure Authentication** - JWT token-based authentication
- 📱 **Responsive Design** - Optimized for desktop and mobile
- 🎨 **Modern UI/UX** - Clean, intuitive interface
- 🔒 **Data Security** - Encrypted data transmission and storage
- 📈 **Admin Dashboard** - Comprehensive admin panel for platform management
- 🌟 **Featured Artworks** - Promote selected pieces on homepage

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2.4 + Django REST Framework
- **Database**: PostgreSQL (SQLite for development)
- **Authentication**: Token-based authentication
- **Media Storage**: Local storage (configurable for AWS S3)
- **API Documentation**: Built-in Django admin + DRF browsable API

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router DOM
- **Styling**: CSS-in-JS (styled components approach)
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with custom service layer

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (production)
- **WSGI Server**: Gunicorn
- **Caching**: Redis (optional)
- **Monitoring**: Django logging framework

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL (for production)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/artify-marketplace.git
   cd artify-marketplace
   ```

2. **Set up Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Load sample data (optional)**
   ```bash
   python manage.py create_sample_data
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 📁 Project Structure

```
artify-marketplace/
├── backend/
│   ├── art_marketplace/          # Django project settings
│   ├── core/                     # User management & core models
│   ├── artworks/                 # Artwork management
│   ├── orders/                   # Shopping cart & orders
│   ├── media/                    # User uploaded files
│   ├── static/                   # Static files
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Authentication
│   │   │   ├── artist/          # Artist dashboard
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── checkout/        # Checkout process
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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Configuration
DEBUG=True
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=artify_db
DB_USER=artify_user
DB_PASSWORD=secure-password
DB_HOST=localhost
DB_PORT=5432

# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Redis Configuration (optional)
REDIS_URL=redis://127.0.0.1:6379/1

# Payment Gateway (optional)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
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
- Token-based authentication using Django REST Framework tokens
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

## 📚 API Documentation

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
- `POST /api/orders/orders/{id}/payment/` - Process payment

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

2. **Run migrations in container**
   ```bash
   docker-compose exec web python manage.py migrate
   docker-compose exec web python manage.py createsuperuser
   ```

### Manual Deployment

#### Backend (Ubuntu/CentOS)

1. **Install system dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv postgresql nginx
   ```

2. **Set up application**
   ```bash
   git clone https://github.com/yourusername/artify-marketplace.git
   cd artify-marketplace/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure database**
   ```bash
   sudo -u postgres createdb artify_db
   sudo -u postgres createuser artify_user
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   ```

5. **Set up Gunicorn service**
   ```bash
   sudo nano /etc/systemd/system/artify.service
   ```

6. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/artify
   sudo ln -s /etc/nginx/sites-available/artify /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

#### Frontend

1. **Build for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to web server**
   ```bash
   # Copy dist/ folder to your web server
   scp -r dist/* user@server:/var/www/artify/
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation as needed
- Ensure responsive design for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & FAQ

### Common Issues

**Q: I'm getting CORS errors**
A: Make sure your frontend URL is added to `CORS_ALLOWED_ORIGINS` in Django settings.

**Q: Images not loading**
A: Check that `MEDIA_URL` and `MEDIA_ROOT` are configured correctly and the media directory has proper permissions.

**Q: Payment processing fails**
A: The default implementation is a simulation. Integrate with a real payment gateway like Stripe or Razorpay for production.

### Getting Help

- 📧 **Email**: support@artify.com
- 💬 **Discord**: [Artify Community](https://discord.gg/artify)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/artify-marketplace/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/artify-marketplace/wiki)

## 🙏 Acknowledgments

- Django REST Framework community
- React.js team
- Lucide Icons for beautiful icons
- All the amazing artists who inspire creativity

## 🔄 Roadmap

### Version 2.0
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered artwork recommendations
- [ ] Social features (artist following, comments)
- [ ] Auction functionality
- [ ] Multi-language support

### Version 1.1 (Next Release)
- [ ] Email notifications
- [ ] Advanced search with image similarity
- [ ] Bulk artwork upload
- [ ] Artist commission tracking
- [ ] Inventory management

---

**Built with ❤️ for the art community**

*Star ⭐ this repository if you found it helpful!*
