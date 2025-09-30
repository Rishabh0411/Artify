#!/bin/bash

# Production deployment script for Artify
set -e

echo "🚀 Starting Artify deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please create it from .env.example"
    exit 1
fi

# Source environment variables
source .env

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🔧 Running Django checks..."
python manage.py check --deploy

echo "📊 Collecting static files..."
python manage.py collectstatic --noinput

echo "🗄️ Running database migrations..."
python manage.py migrate

echo "👤 Creating superuser (if needed)..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@artify.com',
        password='${ADMIN_PASSWORD:-changeme123}'
    )
    print("Superuser created")
else:
    print("Superuser already exists")
EOF

echo "🧹 Cleaning up old files..."
find . -name "*.pyc" -delete
find . -name "__pycache__" -delete

echo "✅ Deployment completed successfully!"
echo "🌟 Your Artify application is ready to serve!"
echo "📋 Don't forget to:"
echo "   - Set up your web server (nginx/apache)"
echo "   - Configure SSL certificates"
echo "   - Set up monitoring and logging"
echo "   - Configure backup procedures"
