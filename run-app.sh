#!/bin/bash
cd backend
uv run uvicorn app:app --reload --port 8080 &
cd ../frontend
npm run dev &
wait
