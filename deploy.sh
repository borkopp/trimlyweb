#!/bin/bash

# Deploy script for Fadely Frontend to Hetzner server
# Usage: ./deploy.sh

set -e

# Configuration
SERVER_HOST="91.98.66.201"
SERVER_USER="root"
SERVER_PATH="/root/fadely-frontend"
LOCAL_PROJECT_PATH="$(pwd)"
PROJECT_NAME="fadely-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists ssh; then
        print_error "SSH is not installed. Please install SSH client."
        exit 1
    fi
    
    if ! command_exists rsync; then
        print_error "rsync is not installed. Please install rsync."
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Test SSH connection
test_ssh_connection() {
    print_status "Testing SSH connection to $SERVER_USER@$SERVER_HOST..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_HOST "echo 'SSH connection successful'" >/dev/null 2>&1; then
        print_success "SSH connection established"
    else
        print_error "Cannot connect to server. Please check:"
        print_error "1. Server is running and accessible"
        print_error "2. SSH key is properly configured"
        print_error "3. Firewall allows SSH connections"
        exit 1
    fi
}

# Build the application
build_application() {
    print_status "Building the application..."
    
    # Clean previous build
    if [ -d ".next" ]; then
        print_status "Cleaning previous build..."
        rm -rf .next
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    if command_exists bun; then
        bun install
    elif command_exists npm; then
        npm install
    else
        print_error "Neither bun nor npm found. Please install a package manager."
        exit 1
    fi
    
    # Build the application
    print_status "Building Next.js application..."
    if command_exists bun; then
        bun run build
    else
        npm run build
    fi
    
    print_success "Application built successfully"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create temporary directory for deployment
    TEMP_DIR=$(mktemp -d)
    DEPLOY_DIR="$TEMP_DIR/$PROJECT_NAME"
    
    # Copy necessary files
    print_status "Copying files to deployment package..."
    mkdir -p "$DEPLOY_DIR"
    
    # Copy built application
    [ -d ".next" ] && cp -r .next "$DEPLOY_DIR/"
    [ -d "public" ] && cp -r public "$DEPLOY_DIR/" && print_status "Copied public directory (including favicon.ico)"
    [ -d "app" ] && cp -r app "$DEPLOY_DIR/"
    [ -d "components" ] && cp -r components "$DEPLOY_DIR/"
    [ -d "contexts" ] && cp -r contexts "$DEPLOY_DIR/"
    [ -d "hooks" ] && cp -r hooks "$DEPLOY_DIR/"
    [ -d "lib" ] && cp -r lib "$DEPLOY_DIR/"
    [ -d "types" ] && cp -r types "$DEPLOY_DIR/"
    [ -d "utils" ] && cp -r utils "$DEPLOY_DIR/"
    
    # Copy configuration files
    [ -f "package.json" ] && cp package.json "$DEPLOY_DIR/"
    [ -f "next.config.mjs" ] && cp next.config.mjs "$DEPLOY_DIR/"
    [ -f "tailwind.config.ts" ] && cp tailwind.config.ts "$DEPLOY_DIR/"
    [ -f "tsconfig.json" ] && cp tsconfig.json "$DEPLOY_DIR/"
    [ -f "postcss.config.mjs" ] && cp postcss.config.mjs "$DEPLOY_DIR/"
    [ -f "components.json" ] && cp components.json "$DEPLOY_DIR/"
    [ -f "middleware.ts" ] && cp middleware.ts "$DEPLOY_DIR/"
    [ -f "instrumentation-client.ts" ] && cp instrumentation-client.ts "$DEPLOY_DIR/"
    
    
    # Copy any other important files
    [ -f "README.md" ] && cp README.md "$DEPLOY_DIR/"
    [ -f ".env.example" ] && cp .env.example "$DEPLOY_DIR/"
    
    # Verify the directory was created and has content
    if [ ! -d "$DEPLOY_DIR" ] || [ -z "$(ls -A "$DEPLOY_DIR" 2>/dev/null)" ]; then
        print_error "Failed to create deployment package"
        exit 1
    fi
    
    # Verify favicon is in the deployment package (Next.js 15 App Router prefers /app/favicon.ico)
    if [ -f "$DEPLOY_DIR/app/favicon.ico" ]; then
        print_success "Favicon found in app directory (recommended for Next.js 15)"
    elif [ -f "$DEPLOY_DIR/public/favicon.ico" ]; then
        print_success "Favicon found in public directory"
    else
        print_warning "Favicon not found in deployment package"
    fi
    
    print_success "Deployment package created at $DEPLOY_DIR"
    # Only output the directory path to stdout (for capture)
    echo "$DEPLOY_DIR"
}

# Deploy to server
deploy_to_server() {
    local deploy_dir="$1"
    
    print_status "Deploying to server..."
    
    # Create server directory if it doesn't exist
    ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
    
    # Sync files to server
    print_status "Syncing files to server..."
    
    # Verify deploy directory exists and has content
    if [ ! -d "$deploy_dir" ]; then
        print_error "Deploy directory does not exist: $deploy_dir"
        exit 1
    fi
    
    if [ -z "$(ls -A "$deploy_dir" 2>/dev/null)" ]; then
        print_error "Deploy directory is empty: $deploy_dir"
        exit 1
    fi
    
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.next/cache' \
        --exclude '.env.local' \
        --exclude '.env.development.local' \
        --exclude '.env.test.local' \
        --exclude '.env.production.local' \
        "$deploy_dir/" "$SERVER_USER@$SERVER_HOST:$SERVER_PATH/"
    
    print_success "Files synced to server"
}

# Restart application
restart_application() {
    print_status "Restarting application..."
    
    ssh $SERVER_USER@$SERVER_HOST "
        cd $SERVER_PATH
        pm2 restart $PROJECT_NAME
    "
    
    print_success "Application restarted"
    
    # Test favicon accessibility
    print_status "Testing favicon accessibility..."
    if curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_HOST:3003/favicon.ico" | grep -q "200"; then
        print_success "Favicon is accessible at http://$SERVER_HOST:3003/favicon.ico"
    else
        print_warning "Favicon may not be accessible - check server configuration"
    fi
}

# Nginx setup removed - user will handle Nginx configuration manually

# Cleanup
cleanup() {
    if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        print_status "Cleaning up temporary files..."
        rm -rf "$TEMP_DIR"
        print_success "Cleanup completed"
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment of $PROJECT_NAME to $SERVER_HOST"
    
    # Set trap to cleanup on exit
    trap cleanup EXIT
    
    # Run deployment steps
    check_prerequisites
    test_ssh_connection
    build_application
    deploy_dir=$(create_deployment_package)
    deploy_to_server "$deploy_dir"
    restart_application
    
    print_success "Deployment completed successfully!"
    print_status "Application restarted and running on port 3003"
    print_status "To check application status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
    print_status "To view logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs $PROJECT_NAME'"
}

# Run main function
main "$@"
