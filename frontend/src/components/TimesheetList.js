import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { timesheetService, setAuthToken } from '../services/api';
import { format } from 'date-fns';
import './TimesheetList.css';

const TimesheetList = ({ refreshTrigger, onEdit }) => {
  const { accounts } = useMsal();
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await loadTimesheets();
      await loadSummary();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, accounts]);

  const loadTimesheets = async () => {
    try {
      setLoading(true);
      // SECURITY NOTE: Using demo token for development
      // In production, use actual MSAL token: 
      // const { instance, accounts } = useMsal();
      // const response = await instance.acquireTokenSilent({ scopes: ["api://your-api/access"], account: accounts[0] });
      // setAuthToken(response.accessToken);
      setAuthToken('demo-token'); // TODO: Replace with actual token in production
      const userId = accounts[0]?.username || 'user@example.com';
      const response = await timesheetService.getAll({ userId });
      setTimesheets(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setError('');
    } catch (err) {
      setError('Failed to load timesheets');
      console.error('Error loading timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      setAuthToken('demo-token'); // TODO: Replace with actual token in production
      const userId = accounts[0]?.username || 'user@example.com';
      const response = await timesheetService.getSummary({ userId });
      setSummary(response.data);
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timesheet entry?')) {
      return;
    }

    try {
      await timesheetService.delete(id);
      loadTimesheets();
      loadSummary();
    } catch (err) {
      console.error('Error deleting timesheet:', err);
      alert('Failed to delete timesheet entry');
    }
  };

  if (loading) {
    return <div className="loading">Loading timesheets...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="timesheet-list-container">
      <h2>My Timesheet Entries</h2>

      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Hours</div>
            <div className="summary-value">{summary.totalHours.toFixed(1)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Entries</div>
            <div className="summary-value">{summary.totalEntries}</div>
          </div>
        </div>
      )}

      {timesheets.length === 0 ? (
        <div className="no-entries">
          <p>No timesheet entries yet. Add your first entry above!</p>
        </div>
      ) : (
        <div className="timesheet-table-container">
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Job Type</th>
                <th>Hours</th>
                <th>Project</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((timesheet) => (
                <tr key={timesheet.id}>
                  <td>{format(new Date(timesheet.date), 'MMM dd, yyyy')}</td>
                  <td>
                    <span className="job-type-badge">{timesheet.jobTypeName}</span>
                  </td>
                  <td className="hours-cell">{timesheet.hours.toFixed(1)}</td>
                  <td>{timesheet.projectName || '-'}</td>
                  <td className="description-cell">{timesheet.description}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(timesheet)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(timesheet.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimesheetList;
