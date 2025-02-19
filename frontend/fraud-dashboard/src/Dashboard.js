import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const FraudRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  '&:hover': {
    backgroundColor: theme.palette.error.main,
  },
}));

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudulentTransactions: 0,
    averageAmount: 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching transactions...');
        
        const response = await axios.get(
          'http://127.0.0.1:8000/api/transactions/',
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Response:', response.data);
        const transactions = response.data.transactions || [];
        setTransactions(transactions);
        
        // Calculate statistics
        const fraudulent = transactions.filter(t => t.is_fraud).length;
        const total = transactions.length;
        const avgAmount = transactions.reduce((acc, t) => acc + t.amount, 0) / (total || 1);
        
        setStats({
          totalTransactions: total,
          fraudulentTransactions: fraudulent,
          averageAmount: avgAmount,
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        
        setError(
          err.response?.data?.error || 
          err.message || 
          'An error occurred while fetching transactions. Please check the console for details.'
        );
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fraud Detection Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h5">
                {stats.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fraudulent Transactions
              </Typography>
              <Typography variant="h5" color="error">
                {stats.fraudulentTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Amount
              </Typography>
              <Typography variant="h5">
                ${stats.averageAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Timestamp</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Fraud Probability</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                component={transaction.is_fraud ? FraudRow : TableRow}
              >
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.timestamp}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {(transaction.fraud_probability * 100).toFixed(1)}%
                </TableCell>
                <TableCell>
                  <Typography color={transaction.is_fraud ? "error" : "success"}>
                    {transaction.is_fraud ? "FRAUD" : "LEGITIMATE"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {transactions.length === 0 && !error && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No transactions found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
