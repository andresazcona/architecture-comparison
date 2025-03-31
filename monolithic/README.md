# Monolithic Application

This directory contains the implementation of a monolithic application for managing users, products, and orders. 

## Features

- **User Management**: Register, authenticate, and manage user profiles.
- **Product Management**: Add, update, delete, and retrieve products.
- **Order Management**: Create, update, and retrieve orders.

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: MySQL or PostgreSQL

## Project Structure

```
monolithic/
├── src/
│   ├── controllers/        # Contains controller files for handling requests
│   ├── models/             # Contains model files for database schemas
│   ├── routes/             # Contains route files for API endpoints
│   ├── middleware/         # Contains middleware for authentication
│   └── app.js              # Entry point of the application
├── package.json             # NPM configuration file
└── README.md                # Documentation for the monolithic application
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd architecture-comparison/monolithic
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database connection in the environment variables or configuration file.

4. Start the application:
   ```
   npm start
   ```

## API Usage

### User Endpoints

- **POST /api/users/register**: Register a new user.
- **POST /api/users/login**: Authenticate a user.
- **GET /api/users/profile**: Retrieve user profile.

### Product Endpoints

- **POST /api/products**: Add a new product.
- **PUT /api/products/:id**: Update an existing product.
- **DELETE /api/products/:id**: Delete a product.
- **GET /api/products**: Retrieve all products.

### Order Endpoints

- **POST /api/orders**: Create a new order.
- **GET /api/orders/:id**: Retrieve an order by ID.
- **PUT /api/orders/:id**: Update an existing order.
- **GET /api/orders**: Retrieve all orders.

## Conclusion

This monolithic application serves as a foundational example for understanding the architecture and functionality of a full-stack application. For further exploration, consider comparing it with a microservices architecture.