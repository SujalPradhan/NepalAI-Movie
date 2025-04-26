# NepalAI Movie: Nepali Movies AI Recommendation and Search

![NepalAI Movie](https://img.shields.io/badge/NepalAI-Movie-blue)
![Status](https://img.shields.io/badge/Status-Development-yellow)
![Python](https://img.shields.io/badge/Python-3.9+-green)
![Django](https://img.shields.io/badge/Django-4.2+-green)
![React](https://img.shields.io/badge/React-18.0+-green)

## Overview

NepalAI Movie is an intelligent platform designed to help users discover and explore Nepali cinema through advanced search capabilities and personalized recommendations. This web application combines modern frontend technologies with AI-powered backend services to create an intuitive and engaging movie discovery experience.

## Key Features

- **AI-Powered Search**: Natural language processing allows users to search for movies using conversational queries
- **Personalized Recommendations**: Smart recommendation system that analyzes user preferences
- **Comprehensive Movie Database**: Detailed information about Nepali films including plot summaries, ratings, and genre classifications
- **Dynamic Genre Categorization**: Browse movies by genre with an intuitive interface
- **Responsive Design**: Modern UI that works seamlessly across desktop and mobile devices
- **User Authentication**: Secure login system with personalized user profiles



## Technology Stack

### Frontend
- React.js
- Bootstrap
- HTML5/CSS3
- JavaScript/ES6+

### Backend
- Django REST Framework
- PostgreSQL
- Google Gemini API
- JWT Authentication

### Development Tools
- Git & GitHub
- VS Code

## Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm 8+
- PostgreSQL

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/NepalAI-Movie.git
cd NepalAI-Movie

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (create .env file)
cp .env.example .env  # Then edit .env with your configuration

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## API Reference

The API documentation is available at `/api/docs/` when running the development server.

Key endpoints:
- `/api/movies/` - Get list of all movies
- `/api/movies/{id}/` - Get details for specific movie
- `/api/recommendations/` - Get personalized movie recommendations
- `/api/search/` - Search movies by different criteria
- `/api/auth/` - Authentication endpoints

## Data Sources

The movie data is sourced from:
- IMDb
- Nepali film industry resources
- User contributions

**Dataset Credits**: The initial dataset is based on [NepalIMDB](https://github.com/NISH1001/nepalimdb/blob/master/README.md) by NISH1001, which provides a collection of Nepali movies data.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to the Nepali film industry for their incredible work
- Thanks to NISH1001 for the NepalIMDB dataset

## Contact

Sujal - [GitHub](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/NepalAI-Movie](https://github.com/yourusername/NepalAI-Movie)

---

Created by Sujal © 2023
