# SPA Commentar App

## Overview

This is a Single Page Application for comments with a backend API. Both frontend and backend are deployed and accessible online.

---

## Frontend

Access the frontend application in your browser here:  
[https://spa-commentar-app.vercel.app/](https://spa-commentar-app.vercel.app/)

---

## Backend API

The backend API is available at:  
[https://spa-commentar-app.onrender.com/](https://spa-commentar-app.onrender.com/)

---

## Usage

- Use the frontend URL to browse and submit comments.
- The frontend communicates with the backend API to fetch and post comments.

---

## Development

If you want to run the project locally for development or testing:

1. Clone the repository.

2. Set environment variables:

   - For frontend:
     ```
     VITE_API_URL=https://spa-commentar-app.onrender.com
     ```

   - For backend:
     ```
     CORS_ORIGINS=https://spa-commentar-app.vercel.app,http://localhost:3000
     ```

3. Run backend server:
   ```bash
   npm run start:dev

