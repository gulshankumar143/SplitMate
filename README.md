# SplitMate

SplitMate is a premium expense sharing and bill splitting platform built with React, Vite, Node.js, Express, MongoDB, Socket.io, and Tailwind CSS.

## Features
- Google OAuth + Email OTP authentication
- JWT auth with refresh tokens
- Expense and group management
- Real-time notifications and chat activity with Socket.io
- File uploads via Cloudinary
- Analytics dashboard and reports
- Admin panel and role-based access control
- Responsive modern UI with Tailwind, Framer Motion, and Material UI

## Project Structure

- `client/` - React frontend
- `server/` - Express backend

## Setup

1. Copy and configure env files:
   - `server/.env.example`
   - `client/.env.example`

2. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`

3. Start development servers:
   - `cd server && npm run dev`
   - `cd client && npm run dev`

4. Build for production:
   - `cd client && npm run build`
   - `cd server && npm start`

## Docker

- `docker-compose up --build`

## Deployment

The app is ready for deployment on Railway, Render, or Vercel with environment variables set in the platform dashboard.
