# 🥛 Muthujaya Dairy E-Commerce Platform

A complete dairy delivery e-commerce platform with mobile app support, built with React, Node.js, MongoDB, and Progressive Web App (PWA) technology.

## 🚀 Features

### For Customers

- 🛒 Browse dairy products (Milk, Curd, Ghee, Paneer, Buttermilk)
- 🛍️ Shopping cart with real-time updates
- 📦 Place and track orders
- 💳 Multiple delivery options (Subscription & One-time)
- 📱 Install as mobile app (PWA)
- 🔔 Order notifications
- 📄 View bills and invoices
- 👤 Profile management

### For Delivery Staff

- 🗺️ View assigned delivery routes
- ✅ Mark deliveries as complete
- 📍 Track delivery status
- 📊 Daily delivery reports

### For Admin

- 👥 User management
- 🥛 Product inventory management
- 🚚 Route creation and assignment
- 💰 Billing and payments
- 📊 Analytics dashboard
- 📈 Revenue tracking

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation
- **PWA** - Mobile app capability
- **Axios** - API calls

### Backend

- **Node.js & Express** - Server
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Passport.js** - Auth middleware
- **Node-cron** - Scheduled tasks

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Clone Repository

```bash
git clone https://github.com/nimal2006/E-COMMERECE.git
cd E-COMMERECE
```

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed database with demo data
node seed.js

# Start server
npm start
```

Backend runs on: http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

## 🎯 Demo Credentials

After running `node seed.js`:

- **Admin:** muthujaya_admin / password123
- **Delivery Boy 1:** delivery_rajesh / password123
- **Delivery Boy 2:** delivery_suresh / password123

## 🌐 Deployment

### Deploy Backend (Render/Railway)

1. Create account on [Render.com](https://render.com)
2. New Web Service → Connect repository
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=your-mongodb-atlas-uri`
   - `JWT_SECRET=your-secret-key`
   - `FRONTEND_URL=your-vercel-url`

### Deploy Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

Or connect GitHub repo to Vercel for auto-deployment.

## 📱 Mobile App

### Install as PWA

1. Visit the deployed URL on mobile
2. Tap browser menu
3. Select "Install App" or "Add to Home Screen"
4. App appears on home screen!

### Build Android APK (Optional)

```bash
cd frontend
npx cap add android
npx cap sync
npx cap open android
# Build APK in Android Studio
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/muthujaya_dairy
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend:**
Update `src/utils/api.js` with your backend URL after deployment.

## 📂 Project Structure

```
E-COMMERECE/
├── backend/
│   ├── config/         # Passport config
│   ├── middleware/     # Auth middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Helpers, cron jobs
│   ├── seed.js         # Database seeder
│   └── server.js       # Express server
├── frontend/
│   ├── public/         # Static files, PWA assets
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── layouts/    # Layout components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Zustand stores
│   │   └── utils/      # API, helpers
│   └── vite.config.js
└── README.md
```

## 🎨 Features in Detail

### Shopping Experience

- Product catalog with search and filters
- Category-based browsing
- Grid/List view toggle
- Add to cart with quantity controls
- Coupon system (FIRST10, DAIRY10)
- Delivery scheduling
- Order history with status tracking

### Admin Dashboard

- User analytics
- Product inventory
- Route management
- Revenue charts
- Billing system
- Delivery tracking

### PWA Features

- Offline functionality
- Install on home screen
- Push notifications
- Fast loading with caching
- Responsive design

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- CORS configuration
- Environment variable protection

## 🚀 Performance Optimizations

- Code splitting with lazy loading
- Image optimization
- PWA caching strategies
- Gzip compression
- Minified production builds
- Memoized components
- GPU-accelerated animations

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Nimal** - [GitHub](https://github.com/nimal2006) | [Repository](https://github.com/nimal2006/muthujaya-dairy-ecommerce)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

**⭐ Star this repo if you find it helpful!**
