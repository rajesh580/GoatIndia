# Hostinger Deployment Configuration Guide

## Build and Output Settings for Hostinger

Use these exact settings in your Hostinger dashboard:

### 1. **Build Command**
```
npm run build
```
This command will:
- Install all root dependencies
- Install backend dependencies
- Install frontend dependencies  
- Build the React frontend for production

### 2. **Package Manager**
```
npm
```

### 3. **Output Directory**
```
frontend/build
```
This is where the built React application files are located after the build process completes.

### 4. **Entry File**
```
backend/server.js
```
This is the Node.js server file that starts your application and serves both the API and the built React frontend.

### 5. **Node.js Version**
```
18+
```

---

## How to Configure in Hostinger

1. **Go to Your Website Settings**
   - Hostinger Dashboard → Select your website
   - Go to "Settings" or "Configuration"

2. **Find Build & Deployment Section**
   - Look for "Build Command"
   - Look for "Output Directory"
   - Look for "Entry File" or "Start Script"

3. **Enter the Values**
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/build`
   - **Entry File**: `backend/server.js`
   - **Package Manager**: `npm`

4. **Set Environment Variables**
   - Go to "Environment Variables" in your Hostinger dashboard
   - Add all variables from `.env.example`:
     ```
     DB_HOST=your_hostinger_db_host
     DB_USER=your_db_username
     DB_PASSWORD=your_db_password
     DB_NAME=your_database_name
     JWT_SECRET=your_random_secret_key
     CLIENT_URL=https://yourdomain.hostinger.com
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_gmail_app_password
     RAZORPAY_KEY_ID=your_razorpay_key
     RAZORPAY_KEY_SECRET=your_razorpay_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     NODE_ENV=production
     PORT=8080
     ```

5. **Save and Deploy**
   - Click "Save" or "Deploy"
   - Hostinger will automatically:
     1. Clone your repository
     2. Install all dependencies
     3. Run the build command
     4. Start your server using the entry file

---

## What Each Setting Does

### Build Command: `npm run build`
- Runs the `build` script from package.json
- Installs dependencies for backend and frontend
- Builds the React application
- Creates optimized production files in `frontend/build`

### Output Directory: `frontend/build`
- This folder contains the compiled React application
- Hostinger will serve these static files through your Express server

### Entry File: `backend/server.js`
- This is the main server file that starts your application
- It serves:
  - Backend API routes (e.g., `/api/auth`, `/api/products`)
  - Built React frontend from `frontend/build` folder
- Node.js will execute this file to start your app

---

## Deployment Flow

```
1. npm install (root package.json)
                ↓
2. npm run build
   ├── npm install (install all dependencies)
   ├── cd backend && npm install
   ├── cd ../frontend && npm install
   └── npm run build (build React frontend)
                ↓
3. node backend/server.js (starts your server)
```

---

## Troubleshooting

### If you get "Unsupported framework" error:
- Make sure you have a `package.json` in the root directory ✓
- Ensure the `build` command is defined ✓
- Check that Node.js version is 18+ ✓

### If deployment fails:
- Check the Hostinger logs for specific errors
- Verify all environment variables are set correctly
- Make sure your GitHub repository has the latest changes pushed

### If the frontend doesn't load:
- Verify `frontend/build` folder exists after build
- Check that `CLIENT_URL` environment variable matches your domain
- Make sure backend is serving the frontend from `frontend/build`

---

## Testing Locally

Before deploying to Hostinger, test locally:

```bash
# Install all dependencies
npm run install-all

# Build for production
npm run build

# Start the server
npm start
```

Then visit `http://localhost:5000` to test your application.
