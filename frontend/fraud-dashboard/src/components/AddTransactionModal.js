import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import InfoIcon from '@mui/icons-material/Info';

const locations = [
  'Online Store',
  'Physical Store',
  'ATM',
  'Mobile Payment',
  'International Payment',
  'Bank Transfer',
  'Other',
];

const AddTransactionModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    location: '',
    transactionTime: dayjs(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (newValue) => {
    setFormData(prev => ({
      ...prev,
      transactionTime: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure transactionTime is properly formatted
      const timestamp = formData.transactionTime instanceof dayjs 
        ? formData.transactionTime.toISOString()
        : dayjs(formData.transactionTime).toISOString();

      // Send only the necessary transaction data
      const response = await axios.post('http://127.0.0.1:8000/api/transactions/create/', {
        amount: parseFloat(formData.amount),
        description: formData.description || 'No description provided',
        location: formData.location,
        timestamp: timestamp,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Record New Transaction
          <Tooltip title="Enter the details of your transaction. Our AI system will automatically analyze it for potential fraud.">
            <InfoIcon sx={{ ml: 1, fontSize: 20, color: 'primary.main', verticalAlign: 'middle' }} />
          </Tooltip>
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <DateTimePicker
            label="When did this happen?"
            value={formData.transactionTime}
            onChange={handleTimeChange}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                helperText: "Select the date and time of the transaction",
                sx: { mb: 3 }
              }
            }}
          />

          <TextField
            name="amount"
            label="Transaction Amount ($)"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Enter the amount in dollars"
            helperText="How much was the transaction for?"
            inputProps={{ step: "0.01", min: "0" }}
            sx={{ mb: 3 }}
          />

          <TextField
            name="location"
            select
            label="Where did this happen?"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            required
            helperText="Select the type of transaction location"
            sx={{ mb: 3 }}
          >
            {locations.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="description"
            label="What was this transaction for?"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="e.g., Monthly grocery shopping, New laptop purchase"
            helperText="Add a brief description to help you remember this transaction"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            minWidth: 120,
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Add Transaction'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransactionModal;
