# holdSmart

## Description
- A Stock Portfolio Application where a user can access to a personalised dashboard where user can add, update, delete stocks.
- Initially user can only view home page. They need to login or sign up to get access to the portfolio or add stocks.
- User can view compare all the stocks they add into thier portfolio and analyse how they are performing and get summary of thier holdings.

## Prerequisites

## Tech Stack

### Frontend:
- React.js
- NPM

### Backend:
- Spring Boot 3.4.1
- Java 23
- Maven
- Spring Data JPA
- MySQL

## Setup and Installation

### Backend (Spring Boot)

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <backend-folder>
    ```

2. Configure your database connection in `application.properties` (if required).
    - Change the database URL, username, password to your local configuration.

3. Add JWT secret-key, Frontend URL as well in `application.properties`.

4. Build and run the Spring Boot application:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
5. The backend should now be running on `http://localhost:8080`.

### Frontend (React.js)

1. Navigate to the frontend folder:
    ```bash
    cd <frontend-folder>
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Add .env file in the root directory to add following varialbes:
   - Finnhub API key which can be obtained from here(<https://finnhub.io/dashboard>).
   - Backend API URL `http://localhost:8080`

5. Run the React app:
    ```bash
    npm start
    ```
4. The frontend should now be running on `http://localhost:3000`.

### Communication Between Frontend and Backend

Ensure that the frontend React app is configured to make API calls to the correct backend URL (e.g., `http://localhost:8080/`).

### Testing the Application

- Navigate to `http://localhost:3000` to see the frontend.
- API requests from the frontend will be routed to the backend running on `http://localhost:8080` and Finnhub live data.

## Assumptions

- The backend and frontend are on separate servers during local development.
- CORS is handled on the backend if you’re making requests from a different origin.
- Database is configured and running locally or on a cloud instance.
- Assumes the backend is configured to handle the expected number of concurrent requests

## Limitations

- The frontend may not be fully responsive on all screen sizes.
- The current architecture may not scale efficiently for large numbers of users.

## Deployed Application

You can access the deployed application at:
- [Deployed Frontend](<https://holdsmart.netlify.app/>)
- [Deployed Backend](<https://holdsmart-be.onrender.com>)

## Live API Documentation

You can access the live stock API documentation here:
- [Finnhub API](<https://finnhub.io/docs/api>)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
