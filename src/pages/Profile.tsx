import { AccountCircle, Lock, Notifications } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [familyCode, setFamilyCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilyCode = async () => {
      if (currentUser?.familyId) {
        try {
          const firestore = getFirestore();
          const familyRef = doc(firestore, 'Families', currentUser.familyId);
          const familyDoc = await getDoc(familyRef);
          if (familyDoc.exists()) {
            const familyData = familyDoc.data();
            setFamilyCode(familyData.familyCode);
          } else {
            console.warn("Family document does not exist in Firestore.");
          }
        } catch (error) {
          console.error('Error fetching family code:', error);
        }
      }
    };

    fetchFamilyCode();
  }, [currentUser?.familyId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {/* User Information Card */}
      <Card
        sx={{
          my: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <AccountCircle sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
            <Typography variant="h6">User Information</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Name: {currentUser?.displayName || 'User'}
          </Typography>
          {familyCode && (
            <Typography variant="body1" color="text.secondary">
              Family Code: {familyCode}
            </Typography>
          )}
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Card */}
      <Card
        sx={{
          my: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Notifications sx={{ mr: 1, color: 'secondary.main', fontSize: 30 }} />
            <Typography variant="h6">Notifications</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage your notification preferences.
          </Typography>
          <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
            Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Update Password Card */}
      <Card
        sx={{
          my: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Lock sx={{ mr: 1, color: 'primary.main', fontSize: 30 }} />
            <Typography variant="h6">Update Password</Typography>
          </Box>
          {/* Include password update form or functionality here */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Log Out Button */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;