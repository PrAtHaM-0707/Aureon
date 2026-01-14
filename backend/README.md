# Aureon E-commerce Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   - Update `.env` file with your MongoDB connection string
   - Default is `mongodb://localhost:27017/aureon` for local MongoDB

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local installation: `mongod` or use MongoDB Compass

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)

### Admin (protected, admin only)
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/products` - Get all products

## Frontend Integration

The frontend is already configured to connect to the backend API. Make sure both servers are running:

- Backend: http://localhost:5000
- Frontend: http://localhost:8080 (Vite dev server)

## Features Implemented

- User authentication with JWT
- Product management
- Order creation and tracking
- Admin dashboard functionality
- MongoDB database integration
- Password hashing with bcrypt
- Input validation and error handling
- CORS configuration
- Rate limiting