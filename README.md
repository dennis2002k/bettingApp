![Demo of betting app](./demo.gif)

# Betting App

A full-stack sports betting application built with Django REST Framework and React.

Users can create accounts, browse events and betting markets, place bets, and track their betting activity. Administrators can create events, manage markets, and settle results. The project uses JWT authentication, Celery with Redis for background task processing, and Django’s database tools for data management.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Python, Django, Django REST Framework
- Authentication: JWT
- Background jobs: Celery + Redis
- Database: SQLite locally (configurable through `DATABASE_URL`)