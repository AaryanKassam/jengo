#!/bin/bash

# Ensure npm is on PATH (fixes "command not found" when using conda)
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# Jengo Development Server Startup Script
echo "🚀 Starting Jengo Development Servers..."
echo ""

if ! command -v npm &>/dev/null; then
  echo "❌ npm not found. Please install Node.js: https://nodejs.org"
  exit 1
fi

# Check if MongoDB is needed
echo "📦 Checking MongoDB connection..."
echo "   Note: If using MongoDB Atlas, make sure your connection string is in server/.env"
echo ""

# Free port 8000 if it's in use (from a previous crash)
if lsof -ti:8000 >/dev/null 2>&1; then
  echo "⚠️  Port 8000 in use — stopping previous process..."
  lsof -ti:8000 | xargs kill -9 2>/dev/null || true
  sleep 2
fi

# Start backend server (port 8000)
echo "🔧 Starting backend server on http://localhost:8000..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to connect to DB and start
sleep 4

# Start frontend client
echo "⚛️  Starting frontend client on http://localhost:5173..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers are starting!"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend API: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
