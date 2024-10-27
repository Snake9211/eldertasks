import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { CalendarToday, Settings } from '@mui/icons-material';

import React from 'react';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const { currentUser } = useUser(); // Access currentUser from context

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.displayName || 'User'}!
      </Typography>

      <Grid container spacing={2}>
        {/* Schedule Walk-thru Card */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5">Schedule your walk-thru</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                Book a free walk-through to get started.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Setup Wizard Card */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Settings sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h5">Let’s get set up!</Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                Use our setup wizard to make your app work hard for you.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Sections */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Your Tasks
        </Typography>
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Typography variant="body1">
            You have no pending tasks. Enjoy your day!
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;