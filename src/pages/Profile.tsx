import { Box, Button, Card, CardContent, Divider, TextField, Typography } from '@mui/material';

import React from 'react';
import { logout } from "../services/authService"; // Import the logout function
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Profile: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogout = async () => {
    try {
      await logout(); // Call logout to sign the user out
      navigate("/login"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>

      <Card style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f7f7f7' }}>
        <CardContent>
          <Typography variant="h6">User Information</Typography>
          <Typography variant="body1" color="textSecondary">Name: Ian Smith</Typography>
          <Typography variant="body1" color="textSecondary">Membership: Premium</Typography>
          <Button variant="outlined" color="primary" style={{ marginTop: '10px' }}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f7f7f7' }}>
        <CardContent>
          <Typography variant="h6">Notifications</Typography>
          <Typography variant="body2" color="textSecondary">Manage your notification preferences.</Typography>
          <Button variant="outlined" color="primary" style={{ marginTop: '10px' }}>
            Notification Settings
          </Button>
        </CardContent>
      </Card>

      <Card style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f7f7f7' }}>
        <CardContent>
          <Typography variant="h6">Update Password</Typography>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            style={{ marginTop: '10px' }}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            style={{ marginTop: '10px' }}
          />
          <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Divider style={{ margin: '20px 0' }} />

      {/* Log Out Button */}
      <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;