# Vanexa Frontend

Modern e-commerce frontend built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

The project uses different environment files for development and production:

- `.env.development` - Used in development mode
- `.env.production` - Used in production build
- `.env.example` - Template for environment variables

**For Development:**
```bash
# .env.development (already configured)
VITE_API_BASE_URL=http://localhost:4000
```

**For Production:**
```bash
# .env.production (already configured)
VITE_API_BASE_URL=https://vanexabackend.onrender.com
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   │   └── Admin/      # Admin dashboard pages
│   ├── services/       # API services
│   ├── store/          # Redux store
│   │   └── slices/     # Redux slices
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env.development    # Development environment
├── .env.production     # Production environment
├── .env.example        # Environment template
└── vite.config.js      # Vite configuration
```

## 🎨 Features

- **Modern UI/UX** - Built with Tailwind CSS and Framer Motion
- **State Management** - Redux Toolkit for global state
- **Authentication** - JWT-based auth with protected routes
- **Product Catalog** - Advanced filtering and search
- **AI Search** - Gemini-powered product recommendations
- **Shopping Cart** - Persistent cart with local storage
- **Order Management** - Track orders and view history
- **Payment Integration** - Razorpay payment gateway
- **Admin Dashboard** - Manage products, orders, and users
- **Responsive Design** - Mobile-first approach

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **Recharts** - Charts for admin dashboard

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:4000` |

## 📦 Key Pages

### Public Pages
- **Home** - Landing page with featured products
- **Shop** - Product catalog with filters
- **Product Detail** - Individual product page
- **Cart** - Shopping cart
- **Checkout** - Order placement
- **Login/Register** - Authentication

### Protected Pages
- **Profile** - User profile management
- **Orders** - Order history
- **Wishlist** - Saved products

### Admin Pages
- **Dashboard** - Analytics and stats
- **Products** - Product management
- **Orders** - Order management
- **Users** - User management

## 🎯 API Integration

The frontend communicates with the backend through REST APIs:

```javascript
// Example API call
import { productAPI } from './services/api';

// Get all products
const { data } = await productAPI.getAll({ 
  category: 'Men', 
  page: 1, 
  limit: 12 
});
```

## 🔒 Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in HTTP-only cookie
4. Protected routes check authentication
5. Unauthorized users redirected to login

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Environment Variables on Hosting
Make sure to set `VITE_API_BASE_URL` in your hosting platform's environment variables.

## 📝 Notes

- Backend must be running for full functionality
- Use `.env.development` for local development
- Use `.env.production` for production builds
- Never commit `.env` files with sensitive data

## 🔗 Links

- **Backend Repository**: [Link to backend repo]
- **Live Demo**: [Your deployed URL]
- **API Documentation**: [API docs URL]

## 📄 License
ISC
