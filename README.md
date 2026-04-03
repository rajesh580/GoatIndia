# Goat India E-Commerce

A full-stack e-commerce application built with React (frontend) and Node.js/Express (backend).

## 🚀 Quick Deploy to Hostinger

### Option 1: One-Click Git Import
1. Go to Hostinger → Websites → Create Website
2. Select "Import from Git"
3. Connect your GitHub repository: `https://github.com/rajesh580/GoatIndia.git`
4. Hostinger will automatically detect Node.js and deploy

### Option 2: Manual Upload
1. Build the application locally:
   ```bash
   npm run build
   ```
2. Upload the entire project to Hostinger via FTP
3. Set the document root to the project folder

### Hostinger Configuration
- **Runtime**: Node.js 18+
- **Entry Point**: `backend/server.js`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Environment Variables (Set in Hostinger Dashboard)
```env
DB_HOST=your_hostinger_db_host
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
CLIENT_URL=https://yourdomain.hostinger.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=8080
NODE_ENV=production
```

## Project Structure

This is a monorepo containing:

- `backend/` - Node.js/Express API server with MySQL database
- `frontend/` - React application with Bootstrap styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rajesh580/GoatIndia.git
cd GoatIndia
```

2. Install dependencies for both frontend and backend:
```bash
npm run install-all
```

Or install separately:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Setup

1. Create a `.env` file in the `backend/` directory with your database and other configurations.

2. Set up your MySQL database and update the connection details in `backend/config/database.js`.

### Running the Application

#### Development Mode
```bash
npm run dev
```
This will start both backend (port 5000) and frontend (port 3000) concurrently.

#### Production Mode
```bash
# Build frontend
npm run build

# Start backend
npm start
```

## Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

Make sure to set environment variables for:
- Database connection
- JWT secret
- Email service credentials
- Razorpay API keys

### Frontend Deployment
The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages

Set the API base URL to your deployed backend URL.

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- Razorpay Payment Gateway
- Nodemailer for emails
- bcryptjs for password hashing

### Frontend
- React 19
- React Router
- Bootstrap 5
- Axios for API calls
- React Hot Toast for notifications
- Framer Motion for animations
- Three.js for 3D elements

## Features

- User authentication (login/register)
- Product catalog with categories
- Shopping cart functionality
- Order management
- Payment integration (Razorpay)
- Admin panel
- Responsive design
- Email notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

ISC