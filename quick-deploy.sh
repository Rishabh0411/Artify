#!/bin/bash

# 🚀 Artify Quick Deployment Script
set -e

echo "🎨 Artify Quick Deployment Script"
echo "================================="
echo ""

# Function to show usage
show_usage() {
    echo "Usage: $0 [dev|prod|status|logs|stop]"
    echo ""
    echo "Commands:"
    echo "  dev     - Start development environment"
    echo "  prod    - Start production environment"
    echo "  status  - Check deployment status"
    echo "  logs    - View application logs"
    echo "  stop    - Stop all services"
    echo "  clean   - Clean up containers and volumes"
    echo ""
    exit 1
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to deploy development environment
deploy_dev() {
    echo "🏃‍♂️ Starting Development Deployment..."
    
    # Check if .env exists
    if [ ! -f "backend/.env" ]; then
        echo "📝 Creating environment file from template..."
        cp backend/.env.example backend/.env
        echo "⚠️  Please edit backend/.env with your configuration before continuing"
        echo "Press Enter to continue when ready..."
        read
    fi
    
    echo "🔨 Building and starting services..."
    docker-compose up --build -d
    
    echo "📊 Running database migrations..."
    sleep 10  # Wait for database to be ready
    docker-compose exec web python manage.py migrate
    
    echo "📦 Collecting static files..."
    docker-compose exec web python manage.py collectstatic --noinput
    
    echo "🎯 Creating superuser (if needed)..."
    docker-compose exec web python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@artify.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"
    
    echo "📋 Loading sample data (optional)..."
    read -p "Do you want to load sample artworks? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec web python manage.py create_sample_data
    fi
    
    show_urls
}

# Function to deploy production environment
deploy_prod() {
    echo "🏭 Starting Production Deployment..."
    
    # Check if production env exists
    if [ ! -f "backend/.env" ]; then
        echo "📝 Creating production environment file..."
        cp backend/.env.production backend/.env
        echo "⚠️  Please edit backend/.env with your production configuration"
        echo "Press Enter to continue when ready..."
        read
    fi
    
    echo "🔨 Building and starting production services..."
    docker-compose -f docker-compose.yml up --build -d
    
    echo "📊 Running database migrations..."
    sleep 15  # Wait longer for production database
    docker-compose exec web python manage.py migrate
    
    echo "📦 Collecting static files..."
    docker-compose exec web python manage.py collectstatic --noinput
    
    echo "🔍 Running deployment checks..."
    docker-compose exec web python manage.py check --deploy
    
    show_urls_prod
}

# Function to show service status
show_status() {
    echo "📊 Service Status:"
    echo "=================="
    docker-compose ps
    echo ""
    
    echo "🌐 Network Connectivity:"
    echo "======================"
    if curl -s http://localhost:8000/health/ >/dev/null 2>&1; then
        echo "✅ Backend: Running (http://localhost:8000)"
    else
        echo "❌ Backend: Not accessible"
    fi
    
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Frontend: Running (http://localhost:3000)"
    else
        echo "❌ Frontend: Not accessible"
    fi
    
    echo ""
    echo "💾 Database Status:"
    docker-compose exec db psql -U postgres -c "SELECT version();" >/dev/null 2>&1 && echo "✅ Database: Connected" || echo "❌ Database: Connection failed"
    
    echo ""
    echo "🗂️ Redis Status:"
    docker-compose exec redis redis-cli ping >/dev/null 2>&1 && echo "✅ Redis: Running" || echo "❌ Redis: Not responding"
}

# Function to show logs
show_logs() {
    echo "📋 Application Logs:"
    echo "==================="
    echo "Press Ctrl+C to exit"
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping all services..."
    docker-compose down
    echo "✅ All services stopped"
}

# Function to clean up
clean_up() {
    echo "🧹 Cleaning up containers and volumes..."
    read -p "Are you sure? This will remove all data! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        echo "✅ Cleanup completed"
    else
        echo "❌ Cleanup cancelled"
    fi
}

# Function to show URLs
show_urls() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo ""
    echo "📍 Your Artify application is running at:"
    echo "   🌐 Frontend:    http://localhost:3000"
    echo "   🔌 Backend API: http://localhost:8000/api/"
    echo "   👤 Admin Panel: http://localhost:8000/admin/"
    echo ""
    echo "🔑 Default Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📊 Useful Commands:"
    echo "   ./quick-deploy.sh status  - Check service status"
    echo "   ./quick-deploy.sh logs    - View logs"
    echo "   ./quick-deploy.sh stop    - Stop services"
    echo ""
}

# Function to show production URLs
show_urls_prod() {
    echo ""
    echo "🎉 Production Deployment Complete!"
    echo "================================="
    echo ""
    echo "📍 Your Artify application should be accessible at:"
    echo "   🌐 Frontend:    https://yourdomain.com"
    echo "   🔌 Backend API: https://yourdomain.com/api/"
    echo "   👤 Admin Panel: https://yourdomain.com/admin/"
    echo ""
    echo "⚠️  Don't forget to:"
    echo "   • Configure your domain DNS"
    echo "   • Setup SSL certificates"
    echo "   • Configure firewall rules"
    echo "   • Setup monitoring and backups"
    echo ""
}

# Main script logic
case "${1:-}" in
    "dev")
        check_docker
        deploy_dev
        ;;
    "prod")
        check_docker
        deploy_prod
        ;;
    "status")
        check_docker
        show_status
        ;;
    "logs")
        check_docker
        show_logs
        ;;
    "stop")
        check_docker
        stop_services
        ;;
    "clean")
        check_docker
        clean_up
        ;;
    *)
        show_usage
        ;;
esac
