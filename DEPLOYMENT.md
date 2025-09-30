# 🚀 Artify Deployment Guide

This guide walks you through deploying Artify in both development and production environments.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git installed
- Domain name (for production)
- SSL certificates (for production)

## 🏃‍♂️ Quick Development Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Clone and setup the project:**
   ```bash
   git clone https://github.com/Rishabh0411/Artify.git
   cd Artify
   ```

2. **Create environment file:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```

4. **Run initial setup:**
   ```bash
   # Run migrations
   docker-compose exec web python manage.py migrate
   
   # Create superuser
   docker-compose exec web python manage.py createsuperuser
   
   # Load sample data (optional)
   docker-compose exec web python manage.py create_sample_data
   ```

5. **Access your application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000/api/
   - **Admin Panel**: http://localhost:8000/admin/

### Option 2: Manual Setup

1. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   
   # Setup environment
   cp .env.example .env
   # Edit .env with your configuration
   
   # Database setup
   python manage.py migrate
   python manage.py createsuperuser
   
   # Start server
   python manage.py runserver
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🏭 Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Server Requirements:**
   - Ubuntu 20.04+ or similar Linux distribution
   - 2GB+ RAM
   - 20GB+ storage
   - Docker and Docker Compose installed

2. **Setup production environment:**
   ```bash
   # Clone repository
   git clone https://github.com/Rishabh0411/Artify.git
   cd Artify
   
   # Copy production environment
   cp backend/.env.production backend/.env
   
   # Edit environment variables
   nano backend/.env
   ```

3. **Configure production settings:**
   ```bash
   # Update docker-compose.yml for production
   # Set proper domain names, SSL certificates, etc.
   
   # Build and deploy
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

4. **Setup SSL certificates:**
   ```bash
   # Using Let's Encrypt (Certbot)
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### Option 2: Manual Production Setup

1. **System Dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip python3-venv postgresql nginx redis-server
   ```

2. **Database Setup:**
   ```bash
   sudo -u postgres createdb artify_prod
   sudo -u postgres createuser artify_user
   sudo -u postgres psql
   ALTER USER artify_user CREATEDB;
   ALTER USER artify_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE artify_prod TO artify_user;
   \\q
   ```

3. **Application Setup:**
   ```bash
   # Create application directory
   sudo mkdir -p /var/www/artify
   cd /var/www/artify
   
   # Clone and setup
   sudo git clone https://github.com/Rishabh0411/Artify.git .
   sudo chown -R $USER:$USER /var/www/artify
   
   # Backend setup
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   
   # Configure environment
   cp .env.production .env
   # Edit .env with production values
   
   # Database setup
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py createsuperuser
   ```

4. **Frontend Build:**
   ```bash
   cd ../frontend
   npm install
   npm run build
   
   # Copy build files to nginx
   sudo cp -r dist/* /var/www/html/
   ```

5. **Gunicorn Service:**
   ```bash
   sudo nano /etc/systemd/system/artify.service
   ```
   
   Add the following content:
   ```ini
   [Unit]
   Description=Artify Django Application
   After=network.target
   
   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/var/www/artify/backend
   Environment="PATH=/var/www/artify/backend/venv/bin"
   ExecStart=/var/www/artify/backend/venv/bin/gunicorn --workers 3 --bind unix:/var/www/artify/backend/artify.sock art_marketplace.wsgi:application
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

6. **Nginx Configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/artify
   ```
   
   Copy the nginx.conf content and adjust paths.

7. **Enable and Start Services:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable artify
   sudo systemctl start artify
   
   sudo ln -s /etc/nginx/sites-available/artify /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔧 Environment Configuration

### Development (.env)
```bash
DEBUG=True
SECRET_KEY=your-dev-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production (.env)
```bash
DEBUG=False
SECRET_KEY=your-super-secure-production-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/artify_prod
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
```

## 🔍 Health Checks

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/api/artworks/
   ```

2. **Database Connection:**
   ```bash
   docker-compose exec web python manage.py check --deploy
   ```

3. **Frontend Build:**
   ```bash
   curl http://localhost:3000
   ```

## 📊 Monitoring and Maintenance

1. **View Logs:**
   ```bash
   # Docker logs
   docker-compose logs -f web
   
   # System logs
   sudo journalctl -u artify -f
   sudo tail -f /var/log/nginx/access.log
   ```

2. **Database Backups:**
   ```bash
   # PostgreSQL backup
   docker-compose exec db pg_dump -U artify_user artify_prod > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Updates:**
   ```bash
   git pull origin main
   docker-compose up --build -d
   docker-compose exec web python manage.py migrate
   docker-compose exec web python manage.py collectstatic --noinput
   ```

## 🛡️ Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure proper ALLOWED_HOSTS
- [ ] Setup SSL certificates
- [ ] Configure firewall rules
- [ ] Setup regular backups
- [ ] Enable monitoring and alerting
- [ ] Review and update dependencies regularly
- [ ] Configure rate limiting
- [ ] Setup proper logging

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   sudo lsof -i :8000
   sudo kill -9 <PID>
   ```

2. **Permission Denied:**
   ```bash
   sudo chown -R $USER:$USER /var/www/artify
   sudo chmod -R 755 /var/www/artify
   ```

3. **Database Connection Issues:**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Test connection
   psql -h localhost -U artify_user -d artify_prod
   ```

4. **Static Files Not Loading:**
   ```bash
   python manage.py collectstatic --noinput
   sudo nginx -s reload
   ```

## 📞 Support

If you encounter any issues during deployment:

1. Check the logs for error messages
2. Review the environment configuration
3. Ensure all dependencies are installed
4. Check firewall and port configurations
5. Create an issue on GitHub with detailed error information

## 🎉 Congratulations!

Your Artify application should now be successfully deployed and running! 

Visit your application:
- **Production**: https://yourdomain.com
- **Development**: http://localhost:3000

Don't forget to:
- Setup monitoring and alerting
- Configure regular backups
- Review security settings
- Setup CI/CD pipelines for automated deployments
