# Aureon - E-Commerce Platform

A modern, full-stack e-commerce platform built with React, TypeScript, Node.js, and MongoDB. Features user authentication, product catalog, shopping cart, secure payments with Razorpay, and an admin dashboard for management.

## 🚀 Features

### Customer Features
- 🔐 **User Authentication**: Secure login/signup with JWT tokens
- 🛍️ **Product Catalog**: Browse products by category, brand, and filters
- 🛒 **Shopping Cart**: Add/remove items, update quantities
- 💳 **Secure Payments**: Integrated Razorpay payment gateway
- 📦 **Order Management**: Track orders, view order history
- 👤 **User Profile**: Manage personal information and settings
- 🔍 **Product Search**: Search and filter products
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- 📊 **Dashboard**: Analytics and statistics overview
- 📝 **Product Management**: Add, edit, delete products
- 👥 **User Management**: View and manage user accounts
- 📋 **Order Management**: Process and update orders
- 📈 **Analytics**: Sales reports and insights
- ⚙️ **Settings**: Configure platform settings

### Technical Features
- 🎨 **Modern UI**: Built with ShadCN UI components and Radix UI
- 🔄 **Real-time Updates**: React Query for efficient data fetching
- 🛡️ **Security**: Helmet, CORS, rate limiting, input validation
- 🚀 **Performance Optimization**: Redis (Upstash) caching implemented for scale
- ⚙️ **Reliability**: Automated keep-alive health endpoints for scalable deployments
- 📊 **Data Visualization**: Charts and analytics with Recharts
- 🔧 **Type Safety**: Full TypeScript implementation
- ⚡ **Build Tool**: Vite for fast development and building

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Modern component library
- **Radix UI** - Accessible UI primitives
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis (Upstash)** - Caching and performance optimization
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway integration
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Redis (Upstash)
- Razorpay account for payments
- `npm` or `yarn` package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrAtHaM-0707/Aureon.git
   cd Aureon
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Environment Setup

1. **Frontend Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

2. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aureon
   JWT_SECRET=your_jwt_secret_key
   CLIENT_ORIGIN=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

### Database Setup

1. **Start MongoDB**
   Make sure MongoDB is running on your system.

2. **Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```

### Running the Application

Open two separate terminals from the root project directory:

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status

### System
- `GET /api/health` - Server keep-alive health check

## 🏗️ Project Structure

```text
Aureon/
├── .gitignore
├── README.md
├── backend/                    # Node.js Express Server
│   ├── src/
│   │   ├── config/             # DB & Redis configurations
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, validation middlewares
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── schemas/            # Validation schemas
│   │   ├── services/           # Business logic & Caching
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Error handling & logging
│   │   ├── server.ts           # Entry point
│   │   └── seed.ts             # Database seeding script
│   ├── package.json
│   └── tsconfig.json
└── frontend/                   # React + Vite Client
    ├── public/                 # Static assets
    ├── src/
    │   ├── components/         # Reusable UI elements (ShadCN, layout)
    │   ├── context/            # React Contexts (Auth, Cart, Admin)
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Util functions & API config
    │   ├── pages/              # Application views & Admin dashboard
    │   ├── App.tsx             # Root component
    │   └── main.tsx            # React DOM render entry
    ├── vercel.json             # Deployment routing
    ├── components.json         # ShadCN config
    ├── tailwind.config.ts      # Tailwind styling rules
    ├── vite.config.ts          # Vite bundler config
    ├── tsconfig.json           # TypeScript configuration
    └── package.json
```

## 🔧 Available Scripts

### Frontend (in `./frontend`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (in `./backend`)
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

## 💳 Payment Integration

The application uses Razorpay for payment processing:
1. **Frontend**: Razorpay checkout modal for secure payments.
2. **Backend**: Order creation and payment verification.
3. **Logs**: Payment flow debugging information can be documented as needed.

## 🔐 Authentication

- **JWT Tokens**: Secure authentication with access tokens
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware for route protection
- **Role-based Access**: Admin and user role separation

## 📊 Admin Dashboard

- **Statistics**: Sales, orders, users, and product metrics
- **Order Management**: View and update order statuses
- **Product Management**: CRUD operations for products
- **User Management**: View and manage user accounts
- **Analytics**: Charts and insights for business intelligence

## 🚀 Deployment

### Frontend (Vercel)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`
3. Set environment variables in the platform dashboard.

### Backend (Render)
1. Set the root directory to `backend`.
2. Start command: `npm run start`
3. Set environment variables in the platform dashboard.
4. Ensure MongoDB and Redis (Upstash) connections are configured.
*(A stay-awake cron ping to `/api/health` is advised for Render free tiers).*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.
