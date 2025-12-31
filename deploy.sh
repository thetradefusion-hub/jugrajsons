#!/bin/bash

# Production Deployment Script
# Usage: ./deploy.sh [frontend|backend|all]

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to deploy frontend
deploy_frontend() {
    echo -e "${GREEN}📦 Building frontend...${NC}"
    cd "$(dirname "$0")"
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
        echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
        if [ -f .env.production.template ]; then
            cp .env.production.template .env.production
            echo -e "${RED}❌ Please update .env.production with your production values!${NC}"
            exit 1
        fi
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build
    echo "Building for production..."
    npm run build
    
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Frontend build successful!${NC}"
        echo "Build output: dist/"
        echo "Next steps:"
        echo "  1. Upload dist/ folder to your hosting provider"
        echo "  2. Configure web server (Nginx/Apache)"
        echo "  3. Set up SSL certificate"
    else
        echo -e "${RED}❌ Frontend build failed!${NC}"
        exit 1
    fi
}

# Function to deploy backend
deploy_backend() {
    echo -e "${GREEN}📦 Building backend...${NC}"
    cd "$(dirname "$0")/backend"
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
        echo -e "${YELLOW}⚠️  .env.production not found. Creating from template...${NC}"
        if [ -f .env.production.template ]; then
            cp .env.production.template .env.production
            echo -e "${RED}❌ Please update .env.production with your production values!${NC}"
            exit 1
        fi
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build TypeScript
    echo "Building TypeScript..."
    npm run build
    
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Backend build successful!${NC}"
        echo "Build output: dist/"
        echo "Next steps:"
        echo "  1. Copy dist/ folder and .env.production to server"
        echo "  2. Run: npm install --production"
        echo "  3. Start with PM2: pm2 start ecosystem.config.js --env production"
    else
        echo -e "${RED}❌ Backend build failed!${NC}"
        exit 1
    fi
}

# Main deployment logic
case "$1" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    all)
        deploy_frontend
        echo ""
        deploy_backend
        ;;
    *)
        echo "Usage: ./deploy.sh [frontend|backend|all]"
        echo ""
        echo "Options:"
        echo "  frontend  - Build frontend only"
        echo "  backend   - Build backend only"
        echo "  all       - Build both frontend and backend"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Deployment process complete!${NC}"

