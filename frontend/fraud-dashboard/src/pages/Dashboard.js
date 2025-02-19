import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import axios from 'axios';
import AddTransactionModal from '../components/AddTransactionModal';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudulentTransactions: 0,
    averageAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:8000/api/transactions/');
      
      const transactionData = response.data.transactions || [];
      setTransactions(transactionData);
      
      // Calculate statistics
      const fraudulent = transactionData.filter(t => t.is_fraud).length;
      const total = transactionData.length;
      const avgAmount = transactionData.reduce((acc, t) => acc + t.amount, 0) / (total || 1);
      
      setStats({
        totalTransactions: total,
        fraudulentTransactions: fraudulent,
        averageAmount: avgAmount,
      });
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    try {
      await fetchTransactions(); // Refresh the list
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Fraud Detection Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
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

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Total Transactions</Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {stats.totalTransactions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Fraudulent Transactions</Typography>
                </Box>
                <Typography variant="h3" component="div">
                  {stats.fraudulentTransactions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h6">Average Amount</Typography>
                </Box>
                <Typography variant="h3" component="div">
                  ${stats.averageAmount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Transactions Table */}
        <Card
          sx={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Button
              onClick={() => navigate('/transactions')}
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              View All
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
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
                {transactions.slice(0, 5).map((transaction) => (
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
                    <TableCell>
                      {(transaction.fraud_probability * 100).toFixed(1)}%
                    </TableCell>
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
          </TableContainer>
        </Card>
      </Box>

      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddTransaction}
      />
    </Container>
  );
};

export default Dashboard;
