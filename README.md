﻿# Digital Dinner

## Description
The Digital Dinner project is an online ordering system for a restaurant. It allows users to browse a menu, add items to their cart, and place orders. The application is designed with a backend to handle user authentication, menu management, cart operations, and order processing.

## Technologies Used
- **Frontend**: ReactJS, TailwindCSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB,PostgreSQL 
- **Authentication**: JWT-based token authentication
- **Storage**: Local file system for images 
- **Hosting**: Render 

## Setup Instructions

### 1. Backend Setup

#### Clone the repository
```bash
git clone https://github.com/vai-sys/DigitalDinner.git
cd DigitalDinner
```

#### Install dependencies
Install the backend dependencies using npm:
```bash
npm install
```

#### Environment variables
Create a `.env` file in the root of the project and include the following variables:
```env

DATABASE_URL="postgres url"
MONGO_URI="Mongodb url"


PORT=5000
NODE_ENV=development


JWT_SECRET=jwt_secret
JWT_EXPIRE=30d


FRONTEND_URL="http://localhost:3000"

```
Replace `url` with the actual URL of your PostgreSQL or MongoDB instance.

#### Database Setup (PostgreSQL)
If you're using PostgreSQL, run the following Prisma commands to generate the database schema:
```bash
npx prisma migrate dev
```

#### Running the Backend Server
Start the backend server:
```bash
npm run dev
```
This will run the server on the specified port .

### 2. Frontend Setup
Go to the frontend directory:
```bash
cd frontend
```

Install the frontend dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm run dev
```


## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login and receive a JWT token.
- **GET** `/api/auth/me`: Get the logged-in user's details (protected route).

### Menu Routes (`/api/menu`)
- **GET** `/api/menu`: Get all menu items.
- **GET** `/api/menu/:id`: Get a single menu item by ID.
- **POST** `/api/menu`: Create a new menu item (requires admin authentication).
- **PUT** `/api/menu/:id`: Update a menu item (requires admin authentication).
- **DELETE** `/api/menu/:id`: Delete a menu item (requires admin authentication).
- **GET** `/api/menu/category/:categoryName`: Get all menu items by category.

### Cart Routes (`/api/cart`)
- **GET** `/api/cart`: Get the user's cart.
- **POST** `/api/cart`: Add an item to the cart.
- **PUT** `/api/cart/:id`: Update a cart item.
- **DELETE** `/api/cart`: Clear the cart.
- **DELETE** `/api/cart/:id`: Remove an item from the cart.

### Order Routes (`/api/orders`)
- **POST** `/api/orders`: Create a new order.
- **GET** `/api/orders/:id`: Get a single order by ID.
- **PUT** `/api/orders/:id`: Update the order status.
- **GET** `/api/orders/user/:userId`: Get all orders by user ID.
- **PUT** `/api/orders/:id/cancel`: Cancel an order.
- **GET** `/api/orders/phone/:phoneNumber`: Get orders by phone number.

## Justification for Database Choice
- **MongoDB**: MongoDB is ideal for storing flexible and semi-structured data. It allows for easy scalability, and is well-suited for handling user and order data with variable attributes. It also integrates seamlessly with JavaScript, especially in a Node.js environment.

- **PostgreSQL**: PostgreSQL is a robust relational database suitable for structured data. It supports complex queries and relationships between different entities (like orders, users, and menu items). PostgreSQL is a good choice if you require ACID compliance and advanced querying features.

## Deployed Frontend
The deployed frontend is available at: https://digitaldinner-2.onrender.com

## Assumptions and Challenges
### Assumptions:
- Users can add multiple items to their cart.
- Orders are tracked with statuses, from pending to completed.
- Admin users can create, update, and delete menu items.

### Challenges:
- Implementing a seamless connection between the frontend and backend.
- Handling file uploads (images) and storing them in a scalable way.
- Managing authentication and ensuring the protection of sensitive routes.
