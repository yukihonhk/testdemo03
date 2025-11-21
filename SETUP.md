# IT Timesheet System - Setup Guide

## Quick Start

Follow these steps to get the IT Timesheet System up and running on your local machine.

### Step 1: Microsoft Entra ID Configuration

Before running the application, you need to register it with Microsoft Entra ID (formerly Azure AD):

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Sign in with your organizational account

2. **Register the Application**
   - Go to "Microsoft Entra ID" (or "Azure Active Directory")
   - Click on "App registrations" in the left sidebar
   - Click "New registration"
   - Fill in the details:
     - **Name**: IT Timesheet System
     - **Supported account types**: Accounts in this organizational directory only (Single tenant)
     - **Redirect URI**: Select "Web" and enter `http://localhost:3000`
   - Click "Register"

3. **Configure API Permissions**
   - In your app registration, go to "API permissions"
   - Ensure "User.Read" (Microsoft Graph) is added (it's added by default)
   - Click "Grant admin consent" if you have admin privileges

4. **Create Client Secret**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add a description (e.g., "Dev Secret")
   - Choose an expiration period
   - Click "Add"
   - **Important**: Copy the secret value immediately - you won't be able to see it again!

5. **Note Your Application Details**
   - Go to "Overview"
   - Copy these values (you'll need them later):
     - **Application (client) ID**
     - **Directory (tenant) ID**
     - **Client Secret** (from step 4)

### Step 2: Install Dependencies

From the root directory of the project:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the convenience script from the root:

```bash
npm run install:all
```

### Step 3: Configure Environment Variables

#### Backend Configuration

1. Navigate to the `backend` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and fill in your Microsoft Entra ID credentials:
   ```
   PORT=5000
   
   AZURE_CLIENT_ID=<your-application-client-id>
   AZURE_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
   AZURE_CLIENT_SECRET=<your-client-secret>
   AZURE_REDIRECT_URI=http://localhost:3000
   
   NODE_ENV=development
   ```

#### Frontend Configuration

1. Navigate to the `frontend` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and fill in your Microsoft Entra ID credentials:
   ```
   REACT_APP_AZURE_CLIENT_ID=<your-application-client-id>
   REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/<your-tenant-id>
   REACT_APP_REDIRECT_URI=http://localhost:3000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Step 4: Start the Application

You need to run both the backend and frontend servers.

#### Option 1: Manual Start (Recommended for development)

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

The backend API will start on http://localhost:5000

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000 and should automatically open in your browser.

#### Option 2: Using Root Scripts

From the root directory, you can use:

```bash
# In one terminal
npm run start:backend

# In another terminal
npm run start:frontend
```

### Step 5: Test the Application

1. Open your browser to http://localhost:3000
2. You should see the IT Timesheet System login page
3. Click "Sign in with Microsoft"
4. Sign in with your organizational account
5. After successful authentication, you'll see the timesheet entry form
6. Try adding a timesheet entry:
   - Select today's date
   - Choose a job type (e.g., "Software Development")
   - Enter hours (e.g., "2.5")
   - Enter a description
   - Click "Add Entry"
7. Your entry should appear in the list below the form
8. You can edit or delete entries using the action buttons

## Troubleshooting

### Common Issues

#### Issue: "AADSTS7000215: Invalid client secret provided"
**Solution**: Your client secret may have expired or is incorrect. Create a new client secret in Azure Portal and update your `.env` files.

#### Issue: "CORS error when calling API"
**Solution**: Ensure the backend server is running and the `REACT_APP_API_URL` in the frontend `.env` matches the backend URL.

#### Issue: "Cannot find module" errors
**Solution**: Make sure you've run `npm install` in both backend and frontend directories.

#### Issue: Login popup is blocked
**Solution**: Allow popups in your browser for localhost:3000. Alternatively, modify the code to use redirect instead of popup authentication.

#### Issue: "Failed to load job types"
**Solution**: Ensure the backend server is running on port 5000 and check the browser console for more details.

### Development Tips

1. **Hot Reload**: Both servers support hot reload. Changes to code will automatically refresh.

2. **API Testing**: You can test the backend API directly using tools like Postman or curl:
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   ```

3. **Clear Cache**: If you experience authentication issues, try:
   - Clearing browser cookies and cache
   - Using incognito/private browsing mode
   - Signing out and signing in again

4. **Check Logs**: Both servers log to the console. Check for error messages if something isn't working.

## Next Steps

Once you have the application running:

1. **Explore Job Types**: View the 15+ predefined IT job types
2. **Create Multiple Entries**: Add several timesheet entries to see the summary statistics
3. **Test Edit/Delete**: Try modifying and removing entries
4. **Test Date Filtering**: Add entries for different dates
5. **Responsive Design**: Try the application on different screen sizes

## Production Deployment

For production deployment, you'll need to:

1. Set up a production database (PostgreSQL, MongoDB, etc.)
2. Configure production environment variables
3. Build the frontend: `npm run build:frontend`
4. Set up a proper web server (nginx, Apache)
5. Use HTTPS for all connections
6. Configure proper CORS policies
7. Implement rate limiting and security measures
8. Set up monitoring and logging

## Getting Help

If you encounter issues:

1. Check the main README.md for additional information
2. Review the browser console for error messages
3. Check backend server logs
4. Verify your Azure AD configuration
5. Open an issue in the GitHub repository

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (React App)    │
└────────┬────────┘
         │
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│  Backend API    │
│   (Express)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────────┐
│ MSAL  │ │ In-Memory   │
│ Auth  │ │ Storage     │
└───┬───┘ └─────────────┘
    │
┌───▼──────────────┐
│ Microsoft        │
│ Entra ID         │
└──────────────────┘
```

The application uses Microsoft Entra ID for authentication, with the frontend communicating with the backend API for all data operations.
