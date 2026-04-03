#!/bin/bash

# Hostinger Deployment Script for Goat India E-Commerce

echo "🚀 Starting Goat India E-Commerce Deployment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🔨 Building frontend..."
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "🌐 Your app will be available at your Hostinger domain"
echo "🔗 API endpoints: /api/*"
echo "📱 Frontend: served from root path"