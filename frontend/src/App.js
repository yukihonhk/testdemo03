import React, { useState } from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import SignInButton from './components/SignInButton';
import SignOutButton from './components/SignOutButton';
import TimesheetForm from './components/TimesheetForm';
import TimesheetList from './components/TimesheetList';
import './App.css';

function TimesheetApp() {
  const { accounts } = useMsal();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTimesheet, setEditingTimesheet] = useState(null);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingTimesheet(null);
  };

  const handleEdit = (timesheet) => {
    setEditingTimesheet(timesheet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingTimesheet(null);
  };

  return (
    <div className="app">
      <AuthenticatedTemplate>
        <header className="app-header">
          <div className="header-content">
            <h1>IT Timesheet System</h1>
            <div className="user-info">
              <span className="user-name">
                {accounts[0]?.name || 'User'}
              </span>
              <SignOutButton />
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <TimesheetForm 
              onSuccess={handleSuccess} 
              editingTimesheet={editingTimesheet}
              onCancel={handleCancel}
            />
            <TimesheetList 
              refreshTrigger={refreshTrigger}
              onEdit={handleEdit}
            />
          </div>
        </main>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <div className="login-container">
          <div className="login-card">
            <h1>IT Timesheet System</h1>
            <p>Record your tasks and activities for the IT department</p>
            <div className="login-features">
              <div className="feature">
                <span className="feature-icon">📝</span>
                <span>Track your daily activities</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⏱️</span>
                <span>Log hours by job type</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>View your timesheet summary</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure Microsoft authentication</span>
              </div>
            </div>
            <SignInButton />
          </div>
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}

function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <TimesheetApp />
    </MsalProvider>
  );
}

export default App;
