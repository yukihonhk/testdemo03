# IT Timesheet System

A comprehensive timesheet web application to record tasks and activities for the IT department. This application integrates with Microsoft Entra ID (formerly Azure AD) for authentication and provides an intuitive UI to capture timesheet details with different IT job types.

## Features

- 🔐 **Microsoft Entra ID Authentication** - Secure login using Microsoft corporate accounts
- 📝 **Timesheet Entry** - Easy-to-use form to log daily activities
- ⏱️ **Multiple Job Types** - 15+ predefined IT job categories including:
  - Software Development
  - Bug Fixing
  - System Administration
  - User Support
  - Documentation
  - Testing
  - Deployment
  - Security Review
  - And more...
- 📊 **Dashboard & Summary** - View your timesheet entries and statistics
- ✏️ **Edit & Delete** - Manage your timesheet entries
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Technology Stack

### Backend
- Node.js with Express
- Microsoft Authentication Library (MSAL) for Node.js
- RESTful API architecture
- In-memory data storage (easily extensible to database)

### Frontend
- React 18
- Microsoft Authentication Library (MSAL) for React
- Modern CSS with responsive design
- Axios for API communication

## Project Structure

```
testdemo03/
├── backend/              # Backend API server
│   ├── config/          # Configuration files
│   ├── data/            # Data models and fixtures
│   ├── middleware/      # Express middleware
│   ├── routes/          # API route handlers
│   ├── server.js        # Main server file
│   └── package.json     # Backend dependencies
├── frontend/            # React frontend application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── config/      # Frontend configuration
│   │   ├── services/    # API services
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json     # Frontend dependencies
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Microsoft Entra ID (Azure AD) tenant and application registration

### Microsoft Entra ID Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Microsoft Entra ID" (formerly Azure Active Directory)
3. Go to "App registrations" and click "New registration"
4. Configure your application:
   - Name: IT Timesheet System
   - Supported account types: Accounts in this organizational directory only
   - Redirect URI: Web - `http://localhost:3000`
5. After registration, note down:
   - Application (client) ID
   - Directory (tenant) ID
6. Go to "Certificates & secrets" and create a new client secret
7. Note down the client secret value (you won't be able to see it again)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Microsoft Entra ID credentials:
   ```
   AZURE_CLIENT_ID=your-client-id
   AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
   AZURE_CLIENT_SECRET=your-client-secret
   AZURE_REDIRECT_URI=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Microsoft Entra ID credentials:
   ```
   REACT_APP_AZURE_CLIENT_ID=your-client-id
   REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
   REACT_APP_REDIRECT_URI=http://localhost:3000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm start
   ```

   The application will open in your browser at `http://localhost:3000`

## Usage

1. **Sign In**: Click "Sign in with Microsoft" and authenticate with your corporate account
2. **Add Entry**: Fill in the timesheet form with:
   - Date
   - Job Type (select from dropdown)
   - Hours worked
   - Project name (optional)
   - Description of work performed
3. **View Entries**: See all your timesheet entries in the table below the form
4. **Edit Entry**: Click the edit (✏️) button to modify an existing entry
5. **Delete Entry**: Click the delete (🗑️) button to remove an entry
6. **View Summary**: See your total hours and number of entries at the top of the list

## API Endpoints

### Authentication
- `GET /api/auth/login` - Get authentication URL
- `POST /api/auth/callback` - Exchange code for token
- `POST /api/auth/logout` - Logout

### Timesheets
- `GET /api/timesheets` - Get all timesheet entries
- `GET /api/timesheets/:id` - Get specific timesheet entry
- `POST /api/timesheets` - Create new timesheet entry
- `PUT /api/timesheets/:id` - Update timesheet entry
- `DELETE /api/timesheets/:id` - Delete timesheet entry
- `GET /api/timesheets/stats/summary` - Get summary statistics

### Job Types
- `GET /api/jobtypes` - Get all job types
- `GET /api/jobtypes/:id` - Get specific job type
- `GET /api/jobtypes/category/:category` - Get job types by category

## Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build` folder.

## Future Enhancements

- Database integration (PostgreSQL, MongoDB, etc.)
- Manager approval workflow
- Report generation (PDF, Excel)
- Calendar view
- Time tracking integration
- Email notifications
- Multi-language support
- Dark mode

## Security Considerations

- Always use HTTPS in production
- Keep your client secrets secure and never commit them to version control
- Implement proper token validation in production
- Add rate limiting to API endpoints
- Implement CORS policies appropriately
- Regular security audits and updates

## License

MIT

## Support

For issues and questions, please open an issue in the GitHub repository.
