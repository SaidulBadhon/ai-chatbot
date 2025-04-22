#!/bin/bash

# Start the backend server
cd ../vercal-ai-chatbot-backend
bun run dev &
BACKEND_PID=$!

# Start the frontend server
cd ../vercal-ai-chatbot
npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
