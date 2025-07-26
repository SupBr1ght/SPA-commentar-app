SPA Commentar App 🧩
This project is a Single Page Application (SPA) for comments, built with Nest.js for the backend, React for the frontend, and PostgreSQL for the database. It's designed to be easily launched using Docker Compose.

🚀 Quick Start
To get the application up and running quickly, follow these steps.
***
⚠️ You need to have Docker and Docker Compose installed on your system.

1. Clone the Repository
First, clone the project repository to your local machine:

Bash

- git clone <repo-url> # Replace <repo-url> with your repository's URL
- cd SPA-commentar-app
2. Create Environment Variables
Create a .env file in the root of the project (next to docker-compose.yml) and add the following environment variables. Remember to replace yourpassword with a strong password.

Code snippet

- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=yourpassword # Change this to a secure password
- POSTGRES_DB=commentsdb
3. Launch Containers
Once the .env file is set up, you can start all services using Docker Compose:

Bash

docker compose up -d
This command will build the images (if they don't exist) and start the backend, frontend, and PostgreSQL database in detached mode.

4. Verify the Application
After the containers are up, you can access the application:

Frontend: Open your browser and go to http://34.227.207.83

Backend API: Access the backend at http://localhost:5000

🛑 Stopping and Cleaning Up
Stopping Services
To stop all running services without removing their data:

Bash

docker compose down
Cleaning Up
To remove all Docker resources (containers, images, volumes, and networks) associated with the project, which is useful for a clean slate:

Bash

docker compose down --volumes --rmi all
docker system prune -f
Contributing
Feel free to fork the repository, open issues, or submit pull requests.
