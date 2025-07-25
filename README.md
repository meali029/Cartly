# 🛒 Cartly - Modern E-Commerce Platform

<div align="center">
  <img src="https://www.logoground.com/uploads/2018191292018-07-284631561C-Cart-logo.jpg" alt="Cartly Logo" width="120" height="120"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-18.0%2B-blue)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green)](https://mongodb.com/)
  [![Status](https://img.shields.io/badge/Status-In%20Development-orange)](https://github.com/meali029/Cartly)
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 About

**Cartly** is a production-ready, full-stack e-commerce platform designed with modern web technologies and industry best practices. Built on the MERN stack, it features comprehensive role-based access control, real-time updates, and a scalable architecture suitable for enterprise-level applications.

### 🎯 Project Goals

- Create a scalable, maintainable e-commerce solution
- Implement industry-standard security practices
- Provide real-time user experiences
- Demonstrate modern full-stack development skills
- Build a portfolio-worthy application

> 🚧 **Development Status**: Currently in active development. Production deployment coming soon!

---

## ✨ Features

### � Authentication & Authorization
- **JWT-based Authentication** with refresh tokens
- **Role-Based Access Control** (Customer, Admin, Inventory Manager, Delivery Personnel)
- **Secure Password Handling** with bcrypt encryption
- **Email Verification** system
- **Password Reset** functionality

### 🛍️ E-Commerce Core
- **Product Catalog** with advanced filtering and search
- **Shopping Cart** with persistent storage
- **Wishlist** functionality
- **Order Management** with status tracking
- **Inventory Tracking** with real-time updates
- **Payment Integration** (Stripe - PKR currency support)

### � Multi-Role Dashboards
- **Customer Portal**: Product browsing, order history, profile management
- **Admin Dashboard**: Complete store management, analytics, user management
- **Inventory Manager**: Stock control, product management, supplier coordination
- **Delivery Personnel**: Route optimization, delivery status updates

### 🔄 Real-Time Features
- **Live Chat Support** with Socket.io
- **Real-time Order Tracking**
- **Inventory Updates** across all user roles
- **Notification System** for order updates

### 📱 User Experience
- **Responsive Design** optimized for all devices
- **Progressive Web App** capabilities
- **Dark/Light Mode** toggle
- **Accessibility** compliant (WCAG 2.1)
- **Performance Optimized** with lazy loading and caching

---

## 🛠️ Tech Stack

### Backend
```javascript
{
  "runtime": "Node.js 18+",
  "framework": "Express.js 4.18+",
  "database": "MongoDB 6.0+ with Mongoose",
  "authentication": "JWT with Passport.js",
  "realtime": "Socket.io",
  "payments": "Stripe API",
  "validation": "Joi",
  "security": "Helmet, CORS, Rate Limiting",
  "testing": "Jest & Supertest",
  "documentation": "Swagger/OpenAPI 3.0"
}
```

### Frontend
```javascript
{
  "library": "React 18+ with Hooks",
  "styling": "Tailwind CSS 3.0+",
  "state": "Context API + useReducer",
  "routing": "React Router DOM 6+",
  "http": "Axios with interceptors",
  "forms": "React Hook Form",
  "icons": "Heroicons",
  "animations": "Framer Motion",
  "charts": "Chart.js",
  "testing": "React Testing Library"
}
```

### DevOps & Tools
```javascript
{
  "version_control": "Git with Conventional Commits",
  "package_manager": "npm",
  "build_tool": "Vite",
  "linting": "ESLint + Prettier",
  "ci_cd": "GitHub Actions",
  "monitoring": "Morgan + Winston",
  "deployment": "Vercel (Frontend) + Railway (Backend)"
}
```

---

## 🏗️ Architecture

### Project Structure
```
Cartly/
├── Backend/                 # Node.js/Express Server
│   ├── config/             # Database & app configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
├── Frontend/               # React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── context/        # Global state
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Helper functions
│   │   └── admin/          # Admin dashboard
│   └── package.json
├── docs/                   # Documentation
├── .github/                # GitHub workflows
└── README.md
```

### Database Schema
```
Users → Products → Categories
  ↓        ↓         ↓
Orders → OrderItems → Cart
  ↓        ↓         ↓
Reviews → Inventory → Payments
```

---

## � Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+ (local or Atlas)
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/meali029/Cartly.git
cd Cartly
```

2. **Backend Setup**
```bash
cd Backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. **Frontend Setup**
```bash
cd ../Frontend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

4. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/api-docs`

---

## ⚙️ Configuration

### Backend Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/cartly

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_FROM=noreply@cartly.com
SENDGRID_API_KEY=your_sendgrid_key

# Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## � API Documentation

### Authentication Endpoints
```http
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
GET    /api/auth/me              # Get current user
POST   /api/auth/forgot-password # Password reset request
PUT    /api/auth/reset-password  # Password reset
```

### Product Endpoints
```http
GET    /api/products             # Get all products
GET    /api/products/:id         # Get single product
POST   /api/products             # Create product (Admin)
PUT    /api/products/:id         # Update product (Admin)
DELETE /api/products/:id         # Delete product (Admin)
```

### Order Endpoints
```http
GET    /api/orders               # Get user orders
GET    /api/orders/:id           # Get single order
POST   /api/orders               # Create order
PUT    /api/orders/:id           # Update order status
```

### Complete API documentation available at `/api-docs` when server is running.

---

## 📸 Screenshots

<div align="center">
  
### Customer Portal
<img src="docs/screenshots/homepage.png" alt="Homepage" width="300"/>
<img src="docs/screenshots/product-detail.png" alt="Product Detail" width="300"/>

### Admin Dashboard
<img src="docs/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="300"/>
<img src="docs/screenshots/inventory-management.png" alt="Inventory" width="300"/>

</div>

---

## 🧪 Testing

```bash
# Backend tests
cd Backend
npm test
npm run test:coverage

# Frontend tests
cd Frontend
npm test
npm run test:coverage
```

### Test Coverage
- Backend: 85%+ code coverage
- Frontend: 80%+ component coverage
- E2E: Critical user journeys covered

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📈 Roadmap

### Phase 1 - Core Features (Current)
- [x] Authentication system
- [x] Product catalog
- [x] Shopping cart
- [x] Order management
- [x] Admin dashboard
- [ ] Payment integration
- [ ] Email notifications

### Phase 2 - Advanced Features
- [ ] Multi-vendor support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Internationalization (i18n)

### Phase 3 - Scale & Performance
- [ ] Microservices architecture
- [ ] Redis caching
- [ ] CDN integration
- [ ] Load balancing
- [ ] Docker containerization

---

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## �‍💻 Author

**Mehboob Ali**

🎓 Computer Science Student & Full-Stack Developer  
💼 Passionate about building scalable web applications  
🌟 Always learning and exploring new technologies

**Connect with me:**
- � [Portfolio](https://mehboobali.netlify.app)
- 💼 [LinkedIn](https://linkedin.com/in/mehboob-ali2004)
- 🐱 [GitHub](https://github.com/meali029)
- 📧 [Email](mailto:mehboobaliali150@gmail.com)

---

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/) for excellent learning resources
- [MongoDB University](https://university.mongodb.com/) for database best practices
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first framework
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Stripe](https://stripe.com/) for payment processing capabilities

---

## ⭐ Support

If you found this project helpful, please give it a ⭐! It helps others discover the project and motivates continued development.

---

<div align="center">
  <p>Made with ❤️ and ☕ by <a href="https://github.com/meali029">Mehboob Ali</a></p>
  <p><em>Building the future of e-commerce, one commit at a time.</em></p>
</div>

```

