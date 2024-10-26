import { Button, Card, CardContent, Typography } from '@mui/material';

import React from 'react';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Welcome, Ian</Typography>
      <Card style={{ margin: '20px 0', padding: '10px', backgroundColor: '#e6f7f9' }}>
        <CardContent>
          <Typography variant="h5">Schedule your walk-thru</Typography>
          <Button variant="contained" color="primary" fullWidth style={{ marginTop: '10px' }}>
            Book your free walk-thru
          </Button>
        </CardContent>
      </Card>

      {/* Add more sections based on your design */}
      <Card style={{ padding: '15px', marginTop: '20px', backgroundColor: '#fdfdfd' }}>
        <Typography variant="h6">Let’s get set up!</Typography>
        <Typography>Use our setup wizard to make your app work hard for you.</Typography>
        <Button variant="outlined" color="primary" style={{ marginTop: '10px' }}>
          Continue
        </Button>
      </Card>
    </div>
  );
};

export default Home;