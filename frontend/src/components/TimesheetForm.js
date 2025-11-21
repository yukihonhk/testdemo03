import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { timesheetService, jobTypesService, setAuthToken } from '../services/api';
import { format } from 'date-fns';
import './TimesheetForm.css';

const TimesheetForm = ({ onSuccess, editingTimesheet, onCancel }) => {
  const { accounts } = useMsal();
  const [jobTypes, setJobTypes] = useState([]);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    jobTypeId: '',
    hours: '',
    description: '',
    projectName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobTypes();
    if (editingTimesheet) {
      setFormData({
        date: editingTimesheet.date.split('T')[0],
        jobTypeId: editingTimesheet.jobTypeId,
        hours: editingTimesheet.hours,
        description: editingTimesheet.description,
        projectName: editingTimesheet.projectName || '',
      });
    }
  }, [editingTimesheet]);

  const loadJobTypes = async () => {
    try {
      setAuthToken('demo-token'); // In production, use actual token
      const response = await jobTypesService.getAll();
      setJobTypes(response.data);
    } catch (err) {
      console.error('Failed to load job types:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedJobType = jobTypes.find(jt => jt.id === parseInt(formData.jobTypeId));
      const data = {
        ...formData,
        userId: accounts[0]?.username || 'user@example.com',
        userName: accounts[0]?.name || 'Demo User',
        jobTypeName: selectedJobType?.name || '',
        hours: parseFloat(formData.hours),
      };

      if (editingTimesheet) {
        await timesheetService.update(editingTimesheet.id, data);
      } else {
        await timesheetService.create(data);
      }

      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        jobTypeId: '',
        hours: '',
        description: '',
        projectName: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save timesheet entry');
      console.error('Error saving timesheet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timesheet-form-container">
      <h2>{editingTimesheet ? 'Edit Timesheet Entry' : 'New Timesheet Entry'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="timesheet-form">
        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobTypeId">Job Type *</label>
          <select
            id="jobTypeId"
            name="jobTypeId"
            value={formData.jobTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Select a job type</option>
            {jobTypes.map(jt => (
              <option key={jt.id} value={jt.id}>
                {jt.name} ({jt.category})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="hours">Hours *</label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            required
            min="0.1"
            max="24"
            step="0.5"
            placeholder="e.g., 2.5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="e.g., Customer Portal"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe the work performed..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : editingTimesheet ? 'Update Entry' : 'Add Entry'}
          </button>
          {editingTimesheet && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TimesheetForm;
