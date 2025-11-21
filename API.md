# API Documentation

This document describes the REST API endpoints available in the IT Timesheet System.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All API endpoints (except health check and auth endpoints) require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "IT Timesheet API is running"
}
```

---

### Authentication

#### GET /auth/login

Get the Microsoft Entra ID authentication URL.

**Response:**
```json
{
  "authUrl": "https://login.microsoftonline.com/..."
}
```

#### POST /auth/callback

Exchange authorization code for access token.

**Request Body:**
```json
{
  "code": "authorization_code"
}
```

**Response:**
```json
{
  "accessToken": "eyJ0eXAiOiJKV1...",
  "idToken": "eyJ0eXAiOiJKV1...",
  "account": {
    "username": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

#### POST /auth/logout

Logout the current user.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### Job Types

#### GET /jobtypes

Get all available job types.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Software Development",
    "category": "Development",
    "description": "Writing and maintaining code"
  },
  ...
]
```

#### GET /jobtypes/:id

Get a specific job type by ID.

**Parameters:**
- `id` (integer) - Job type ID

**Response:**
```json
{
  "id": 1,
  "name": "Software Development",
  "category": "Development",
  "description": "Writing and maintaining code"
}
```

#### GET /jobtypes/category/:category

Get job types filtered by category.

**Parameters:**
- `category` (string) - Category name (e.g., "Development", "Infrastructure")

**Response:**
```json
[
  {
    "id": 1,
    "name": "Software Development",
    "category": "Development",
    "description": "Writing and maintaining code"
  },
  ...
]
```

---

### Timesheets

#### GET /timesheets

Get all timesheet entries with optional filtering.

**Query Parameters:**
- `userId` (string, optional) - Filter by user ID
- `startDate` (string, optional) - Filter by start date (ISO 8601)
- `endDate` (string, optional) - Filter by end date (ISO 8601)

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user@example.com",
    "userName": "John Doe",
    "date": "2025-11-21",
    "jobTypeId": 1,
    "jobTypeName": "Software Development",
    "hours": 4.5,
    "description": "Implemented timesheet web application",
    "projectName": "IT Timesheet System",
    "status": "submitted",
    "createdAt": "2025-11-21T11:56:13.061Z",
    "updatedAt": "2025-11-21T11:56:13.061Z"
  },
  ...
]
```

#### GET /timesheets/:id

Get a specific timesheet entry by ID.

**Parameters:**
- `id` (integer) - Timesheet entry ID

**Response:**
```json
{
  "id": 1,
  "userId": "user@example.com",
  "userName": "John Doe",
  "date": "2025-11-21",
  "jobTypeId": 1,
  "jobTypeName": "Software Development",
  "hours": 4.5,
  "description": "Implemented timesheet web application",
  "projectName": "IT Timesheet System",
  "status": "submitted",
  "createdAt": "2025-11-21T11:56:13.061Z",
  "updatedAt": "2025-11-21T11:56:13.061Z"
}
```

#### POST /timesheets

Create a new timesheet entry.

**Request Body:**
```json
{
  "userId": "user@example.com",
  "userName": "John Doe",
  "date": "2025-11-21",
  "jobTypeId": 1,
  "jobTypeName": "Software Development",
  "hours": 4.5,
  "description": "Implemented timesheet web application",
  "projectName": "IT Timesheet System"
}
```

**Validation Rules:**
- `userId` - Required, not empty
- `date` - Required, valid ISO 8601 date
- `jobTypeId` - Required, integer
- `hours` - Required, float between 0.1 and 24
- `description` - Required, not empty
- `projectName` - Optional

**Response:**
```json
{
  "id": 1,
  "userId": "user@example.com",
  "userName": "John Doe",
  "date": "2025-11-21",
  "jobTypeId": 1,
  "jobTypeName": "Software Development",
  "hours": 4.5,
  "description": "Implemented timesheet web application",
  "projectName": "IT Timesheet System",
  "status": "submitted",
  "createdAt": "2025-11-21T11:56:13.061Z",
  "updatedAt": "2025-11-21T11:56:13.061Z"
}
```

#### PUT /timesheets/:id

Update an existing timesheet entry.

**Parameters:**
- `id` (integer) - Timesheet entry ID

**Request Body:**
```json
{
  "date": "2025-11-21",
  "jobTypeId": 1,
  "hours": 5.0,
  "description": "Updated description",
  "projectName": "Updated Project"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": "user@example.com",
  "userName": "John Doe",
  "date": "2025-11-21",
  "jobTypeId": 1,
  "jobTypeName": "Software Development",
  "hours": 5.0,
  "description": "Updated description",
  "projectName": "Updated Project",
  "status": "submitted",
  "createdAt": "2025-11-21T11:56:13.061Z",
  "updatedAt": "2025-11-21T12:00:00.000Z"
}
```

#### DELETE /timesheets/:id

Delete a timesheet entry.

**Parameters:**
- `id` (integer) - Timesheet entry ID

**Response:**
```json
{
  "message": "Timesheet deleted successfully"
}
```

#### GET /timesheets/stats/summary

Get summary statistics for timesheet entries.

**Query Parameters:**
- `userId` (string, optional) - Filter by user ID

**Response:**
```json
{
  "totalHours": 13.5,
  "totalEntries": 3,
  "byJobType": {
    "Software Development": 4.5,
    "Code Review": 3.0,
    "User Support": 6.0
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

Invalid request parameters or validation errors.

```json
{
  "errors": [
    {
      "msg": "Valid date is required",
      "param": "date",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized

Missing or invalid authentication token.

```json
{
  "error": "No authorization header provided"
}
```

### 403 Forbidden

Valid token but insufficient permissions.

```json
{
  "error": "Invalid token"
}
```

### 404 Not Found

Resource not found.

```json
{
  "error": "Timesheet not found"
}
```

### 500 Internal Server Error

Server error.

```json
{
  "error": "Something went wrong!",
  "message": "Error details..."
}
```

---

## Example Usage

### Using cURL

```bash
# Get all job types
curl -H "Authorization: Bearer demo-token" \
  http://localhost:5000/api/jobtypes

# Create a timesheet entry
curl -X POST \
  -H "Authorization: Bearer demo-token" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "userName": "John Doe",
    "date": "2025-11-21",
    "jobTypeId": 1,
    "jobTypeName": "Software Development",
    "hours": 4.5,
    "description": "Implemented feature X",
    "projectName": "Project Alpha"
  }' \
  http://localhost:5000/api/timesheets

# Get summary
curl -H "Authorization: Bearer demo-token" \
  "http://localhost:5000/api/timesheets/stats/summary?userId=user@example.com"
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

// Configure base URL and auth token
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': 'Bearer demo-token'
  }
});

// Get all timesheets
const timesheets = await api.get('/timesheets', {
  params: { userId: 'user@example.com' }
});

// Create timesheet entry
const newEntry = await api.post('/timesheets', {
  userId: 'user@example.com',
  userName: 'John Doe',
  date: '2025-11-21',
  jobTypeId: 1,
  jobTypeName: 'Software Development',
  hours: 4.5,
  description: 'Implemented feature X',
  projectName: 'Project Alpha'
});
```
