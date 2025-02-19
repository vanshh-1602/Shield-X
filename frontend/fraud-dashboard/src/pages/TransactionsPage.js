import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import AddTransactionModal from '../components/AddTransactionModal';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:8000/api/transactions/');
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTransactions = transactions.filter(transaction => {
    let matchesDate = true;
    let matchesAmount = true;

    if (startDate && endDate) {
      const transactionDate = new Date(transaction.timestamp);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }

    if (amountFilter) {
      matchesAmount = transaction.amount >= parseFloat(amountFilter);
    }

    return matchesDate && matchesAmount;
  });

  const handleAddTransaction = async (newTransaction) => {
    try {
      // In a real app, you would make an API call here
      console.log('Adding transaction:', newTransaction);
      await fetchTransactions(); // Refresh the list
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transactions
        </Typography>
        
        {/* Filters and Add Transaction Button */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Minimum Amount"
              type="number"
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              Add Transaction
            </Button>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white' }}>Fraud Probability</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transition: 'background-color 0.2s',
                      },
                    }}
                  >
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{(transaction.fraud_probability * 100).toFixed(1)}%</TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.is_fraud ? 'FRAUDULENT' : 'LEGITIMATE'}
                        color={transaction.is_fraud ? 'error' : 'success'}
                        sx={{
                          fontWeight: 500,
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredTransactions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddTransaction}
      />
    </Container>
  );
};

export default TransactionsPage;
