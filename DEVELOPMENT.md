# Artify Development Guide

## Development Setup

### Initial Setup
1. **Clone and Setup**
   ```bash
   git clone https://github.com/Rishabh0411/Artify.git
   cd Artify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. **Environment Configuration**
   Edit `.env` file:
   ```env
   DEBUG=True
   SECRET_KEY=dev-secret-key-not-for-production
   DATABASE_URL=sqlite:///db.sqlite3
   ```

4. **Database Setup**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py loaddata fixtures/sample_data.json  # Optional sample data
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Development Workflow

#### Starting Development Servers
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - Redis (optional, for full functionality)
redis-server
```

#### Creating New Features

1. **Backend Changes**
   ```bash
   # Create new app
   python manage.py startapp new_feature
   
   # Add to INSTALLED_APPS in settings.py
   # Create models, views, serializers
   # Create migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Write tests
   python manage.py test new_feature
   ```

2. **Frontend Changes**
   ```bash
   # Create components in src/components/
   # Add routes in App.jsx
   # Add API calls in services/
   # Test changes
   npm run lint
   ```

#### Code Quality
```bash
# Backend
cd backend
black .                    # Format code
flake8 .                  # Lint code
python manage.py test     # Run tests

# Frontend
cd frontend
npm run lint              # Lint code
npm run format            # Format code (if configured)
```

### Database Management

#### Migrations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations

# Rollback migrations
python manage.py migrate app_name 0001
```

#### Sample Data
```bash
# Create fixtures
python manage.py dumpdata app_name > fixtures/app_data.json

# Load fixtures
python manage.py loaddata fixtures/app_data.json
```

#### Database Reset
```bash
# DANGER: This will delete all data
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
```

### Testing

#### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test core

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Creates htmlcov/ directory
```

#### Frontend Testing (if implemented)
```bash
cd frontend
npm run test
npm run test:coverage
```

### API Development

#### Testing API Endpoints
```bash
# Using curl
curl -X GET http://localhost:8000/api/artworks/

# Using HTTPie (recommended)
http GET localhost:8000/api/artworks/

# With authentication
http GET localhost:8000/api/profile/ Authorization:"Token your_token"
```

#### API Documentation
- Swagger UI: http://localhost:8000/api/schema/swagger-ui/
- ReDoc: http://localhost:8000/api/schema/redoc/
- OpenAPI Schema: http://localhost:8000/api/schema/

### Environment Variables

#### Development (.env)
```env
DEBUG=True
SECRET_KEY=dev-key-change-in-production
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
REDIS_URL=redis://localhost:6379/0
```

#### Testing (.env.test)
```env
DEBUG=True
SECRET_KEY=test-key
DATABASE_URL=sqlite:///:memory:
EMAIL_BACKEND=django.core.mail.backends.locmem.EmailBackend
```

### Common Commands

#### Django Management Commands
```bash
# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Django shell
python manage.py shell

# Show Django version
python manage.py version

# Check for problems
python manage.py check
```

#### Frontend Commands
```bash
# Install new package
npm install package-name

# Update packages
npm update

# Build for production
npm run build

# Preview production build
npm run preview
```

### Debugging

#### Django Debug Toolbar (Development)
Add to settings.py:
```python
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']
```

#### Logging Configuration
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

#### React Developer Tools
- Install React DevTools browser extension
- Use React Developer Tools for component debugging

### Performance Optimization

#### Backend Optimization
```python
# Use select_related for foreign keys
artworks = Artwork.objects.select_related('artist', 'category')

# Use prefetch_related for many-to-many
artworks = Artwork.objects.prefetch_related('tags', 'images')

# Add database indexes
class Meta:
    indexes = [
        models.Index(fields=['created_at']),
        models.Index(fields=['price', 'availability']),
    ]
```

#### Frontend Optimization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));
```

### Troubleshooting

#### Common Issues

1. **Migration Conflicts**
   ```bash
   python manage.py migrate --fake-initial
   ```

2. **Port Already in Use**
   ```bash
   # Kill process on port
   sudo lsof -t -i tcp:8000 | xargs kill -9
   ```

3. **Node Module Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Python Dependencies**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt --force-reinstall
   ```

### IDE Configuration

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "eslint.workingDirectories": ["frontend"],
  "editor.formatOnSave": true
}
```

#### PyCharm Configuration
- Set Python interpreter to `./backend/venv/bin/python`
- Enable Django support in settings
- Configure code style to use Black

### Contributing Guidelines

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test Changes**
   ```bash
   python manage.py test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   # Create pull request on GitHub
   ```

### Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
