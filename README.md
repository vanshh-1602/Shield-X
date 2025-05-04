# Shield X - Fraud Detection System

A modern, AI-powered fraud detection system built with Django and React. This system helps detect potentially fraudulent credit card transactions using machine learning.

## Features

- 🔒 Real-time fraud detection
- 📊 Interactive dashboard
- 📱 Responsive design
- 🎯 User-friendly transaction input
- 📈 Transaction history and analytics

## Project Structure
```
Shield-X/
├── backend/                # Django backend
│   ├── api/               # API endpoints and ML logic
│   ├── data/              # Data files (managed by Git LFS)
│   └── requirements.txt   # Python dependencies
└── frontend/              # React frontend
    ├── fraud-dashboard/   # Dashboard application
    └── package.json       # Node.js dependencies
```

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- Git LFS (for handling large data files)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vanshh-1602/Shield-X.git
cd Shield-X
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv env
.\env\Scripts\activate  # On Windows
source env/bin/activate # On Unix/macOS

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend/fraud-dashboard

# Install dependencies
npm install

# Start development server
npm start
```

## Accessing the Application

- Backend API: http://localhost:8000
- Frontend Dashboard: http://localhost:3000

## Data Files

This project uses Git LFS to handle large data files. The credit card transaction dataset is stored using Git LFS. To work with the data:

1. Install Git LFS: https://git-lfs.github.com/
2. After cloning, run: `git lfs pull` to download the data files

## Team

- **Vansh Bhadoria** - Project Lead/Manager, Full Stack Dev
- **Vedant Singh** - ML/AI/Data Specialist
- **Utkarsh Awasthi** - Database Specialist

