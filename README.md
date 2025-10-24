# 🎨 Sanket Kurve's Portfolio

A modern, full-stack MERN portfolio website with admin panel, email notifications, and file upload system.

## 🚀 Quick Start

### Development Setup
```bash
# Install all dependencies
npm install

# Set up environment variables
cp backend-express/.env.example backend-express/.env
# Edit .env with your MongoDB Atlas connection string

# Seed database with sample data (first time only)
npm run seed

# Start development server (backend + frontend)
npm run dev
```

### Production Deployment
```bash
# Deploy to Vercel (includes both frontend and backend)
npm run build
vercel --prod
```

**Admin Login:**
- Username: `SanketKurve`
- Password: `sanket2005`

**Access:**
- Development: http://localhost:3000
- Production: https://your-portfolio.vercel.app
- Admin Panel: https://your-portfolio.vercel.app/admin/

## 📊 Tech Stack

- **Frontend:** React 19, Tailwind CSS, React Router, Axios, Framer Motion
- **Backend:** Express.js, Mongoose (MongoDB), JWT, bcryptjs
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Vercel (Full MERN stack)
- **Authentication:** JWT tokens with secure password hashing

## 🏗️ Project Structure

```
/app/
├── backend-express/          # Express.js backend
│   ├── models/              # Mongoose models
│   ├── middleware/          # Auth middleware
│   ├── server.js           # Main API server
│   └── seed-data.js        # Database seeding
├── frontend/               # React frontend
│   ├── src/
│   │   ├── admin2/        # Admin panel
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── pages/         # Page components
│   └── public/            # Static assets
├── vercel.json           # Vercel deployment config
└── package.json         # Root package manager
```

## 🔧 Environment Variables

### Development (.env)
```env
MONGO_URL=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

### Production (Vercel)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## 📋 Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Admin Panel** - Full CRUD operations for content
- ✅ **Contact Form** - With email notifications
- ✅ **Skills Animation** - Interactive 3D skill visualization
- ✅ **Project Showcase** - With filtering and search
- ✅ **Certificate Management** - Upload and verify certificates
- ✅ **Message Management** - Admin inbox for contact forms
- ✅ **JWT Authentication** - Secure admin access
- ✅ **MongoDB Atlas** - Cloud database
- ✅ **Vercel Deployment** - Zero-config deployment

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect GitHub repo** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel handles both frontend and backend
4. **Access admin panel** at `/admin/`

### Manual Deployment
```bash
# Frontend only
cd frontend && yarn build
# Deploy build/ folder to any static host

# Backend only
cd backend-express && npm start
# Deploy to any Node.js host (Heroku, Railway, etc.)
```

## 📞 Contact

- **Email:** sanketkurve.2005@gmail.com
- **GitHub:** [@SanketKurve](https://github.com/SanketKurve)
- **LinkedIn:** [Sanket Kurve](https://www.linkedin.com/in/sanket-kurve-03a8b3196)
