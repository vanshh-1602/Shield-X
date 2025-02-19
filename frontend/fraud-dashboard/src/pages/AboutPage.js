import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  useTheme,
  Paper,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';

const teamMembers = [
  {
    name: 'Vansh Bhadoria',
    role: 'Project Lead & Full Stack Developer',
    description: 'Led the project development and integrated ML, backend, and frontend components. Expertise in React, Django, and machine learning integration.',
    avatar: 'https://ui-avatars.com/api/?name=Vansh+Bhadoria&background=0D8ABC&color=fff',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
  },
  {
    name: 'Vedant Singh',
    role: 'ML/AI/Data Specialist',
    description: 'Expert in machine learning algorithms and data analysis. Focused on implementing and optimizing fraud detection models.',
    avatar: 'https://ui-avatars.com/api/?name=Vedant+Singh&background=2E7D32&color=fff',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
  },
  {
    name: 'Utkarsh Awasthi',
    role: 'Database Specialist',
    description: 'Specializes in database architecture and optimization. Ensures efficient data storage and retrieval for the application.',
    avatar: 'https://ui-avatars.com/api/?name=Utkarsh+Awasthi&background=C62828&color=fff',
    icon: <StorageIcon sx={{ fontSize: 40 }} />,
  },
];

const AboutPage = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
          color: 'white',
          py: 6,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            About Shield X
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Protecting your transactions with advanced AI technology
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Mission Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Our Mission
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              At Shield X, we're committed to protecting businesses and individuals
              from financial fraud through cutting-edge technology and machine learning.
              Our advanced fraud detection system processes millions of transactions
              daily, ensuring the security of our clients' financial operations.
            </Typography>
            <Typography variant="body1">
              We believe in making advanced security accessible to everyone. Our
              system combines the power of artificial intelligence with user-friendly
              interfaces, making it easy for businesses of all sizes to protect
              their transactions.
            </Typography>
          </Paper>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 4 }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className="hover-lift"
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        border: '4px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {member.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                      sx={{ fontWeight: 500, mb: 2 }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                    >
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Our Technology
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              We leverage state-of-the-art machine learning algorithms and real-time
              data processing to detect fraudulent transactions with high accuracy.
              Our system analyzes hundreds of data points per transaction, providing
              instant risk assessment and fraud probability scores.
            </Typography>
            <Typography variant="body1">
              Key features of our technology stack:
            </Typography>
            <ul>
              <Typography component="li" sx={{ mt: 1 }}>
                Advanced ML models for fraud detection
              </Typography>
              <Typography component="li" sx={{ mt: 1 }}>
                Real-time transaction monitoring
              </Typography>
              <Typography component="li" sx={{ mt: 1 }}>
                Secure API integration
              </Typography>
              <Typography component="li" sx={{ mt: 1 }}>
                User-friendly dashboard and analytics
              </Typography>
            </ul>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
