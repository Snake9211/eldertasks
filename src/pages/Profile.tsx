import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Alert as MuiAlert,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  Edit,
  FamilyRestroom,
  Lock,
  Notifications,
  Save,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Ensure auth is imported
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { signOut, updatePassword, updateProfile } from 'firebase/auth'; // Import signOut

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setUser } = useUser();
  const [familyCode, setFamilyCode] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);

  // Dialog States
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false);
  const [openNotificationSettings, setOpenNotificationSettings] = useState<boolean>(false);
  const [openChangeFamilyCode, setOpenChangeFamilyCode] = useState<boolean>(false); // New Dialog

  // Form States
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [notifications, setNotifications] = useState<{ email: boolean }>({ email: true });
  const [newFamilyCode, setNewFamilyCode] = useState<string>('');

  // Loading and Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchFamilyData = async () => {
      if (currentUser?.familyId) {
        try {
          const familyRef = doc(db, 'Families', currentUser.familyId);
          const familySnap = await getDoc(familyRef);
          if (familySnap.exists()) {
            const familyData = familySnap.data();
            setFamilyCode(familyData.familyCode || 'N/A');
            setFamilyName(familyData.surname || 'N/A');
            setNotifications(familyData.notifications || { email: true });
          } else {
            setError('Family data not found.');
            console.warn('Family data not found in Firestore');
          }
        } catch (err) {
          console.error('Error fetching family data:', err);
          setError('Failed to load family data.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No family associated with the user.');
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [currentUser]);

  // Handlers for Opening and Closing Dialogs
  const handleOpenEditProfile = () => {
    setNewDisplayName(currentUser?.displayName || '');
    setOpenEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setOpenEditProfile(false);
    setNewDisplayName('');
  };

  const handleOpenUpdatePassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setOpenUpdatePassword(true);
  };

  const handleCloseUpdatePassword = () => {
    setOpenUpdatePassword(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleCloseNotificationSettings = () => {
    setOpenNotificationSettings(false);
  };

  const handleOpenChangeFamilyCode = () => {
    setNewFamilyCode('');
    setOpenChangeFamilyCode(true);
  };

  const handleCloseChangeFamilyCode = () => {
    setOpenChangeFamilyCode(false);
    setNewFamilyCode('');
  };

  // Handlers for Forms
  const handleEditProfile = async () => {
    if (!auth.currentUser) return; // Use Firebase's User
    setActionLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName: newDisplayName });

      // Update Firestore user document
      const userRef = doc(db, 'Users', auth.currentUser.uid);
      await updateDoc(userRef, { displayName: newDisplayName });

      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      // Optionally, update UserContext's currentUser displayName
      setUser(prev => prev ? { ...prev, displayName: newDisplayName } : null);
      handleCloseEditProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!auth.currentUser) return; // Use Firebase's User
    setActionLoading(true);
    try {
      // Re-authentication is required for sensitive operations
      // Implement re-authentication here if necessary

      await updatePassword(auth.currentUser, newPassword);
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
      handleCloseUpdatePassword();
    } catch (err: any) {
      console.error('Error updating password:', err);
      let message = 'Failed to update password.';
      if (err.code === 'auth/requires-recent-login') {
        message = 'Please log in again and try updating your password.';
      }
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleNotification = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, email: event.target.checked });
  };

  const handleSaveNotificationSettings = async () => {
    if (!currentUser?.familyId) return;
    setActionLoading(true);
    try {
      const familyRef = doc(db, 'Families', currentUser.familyId);
      await updateDoc(familyRef, { notifications });
      setSnackbar({ open: true, message: 'Notification settings updated!', severity: 'success' });
      handleCloseNotificationSettings();
    } catch (err) {
      console.error('Error updating notifications:', err);
      setSnackbar({ open: true, message: 'Failed to update notifications.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeFamilyCode = async () => {
    if (!currentUser?.familyId) return;
    const trimmedCode = newFamilyCode.trim().toUpperCase();

    if (!trimmedCode) {
      setSnackbar({ open: true, message: 'Family code cannot be empty.', severity: 'error' });
      return;
    }

    // Define a pattern for family codes (e.g., 6 alphanumeric characters)
    const familyCodePattern = /^[A-Z0-9]{6}$/;
    if (!familyCodePattern.test(trimmedCode)) {
      setSnackbar({ open: true, message: 'Family code must be 6 alphanumeric characters.', severity: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      // Check if the new family code already exists
      const familiesRef = collection(db, 'Families');
      const q = query(familiesRef, where('familyCode', '==', trimmedCode));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setSnackbar({ open: true, message: 'Family code already in use. Please choose another.', severity: 'error' });
        setActionLoading(false);
        return;
      }

      // Update the family code in Firestore
      const familyRef = doc(db, 'Families', currentUser.familyId);
      await updateDoc(familyRef, { familyCode: trimmedCode });

      setFamilyCode(trimmedCode);
      setSnackbar({ open: true, message: 'Family code updated successfully!', severity: 'success' });
      handleCloseChangeFamilyCode();
    } catch (err) {
      console.error('Error changing family code:', err);
      setSnackbar({ open: true, message: 'Failed to change family code.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase's signOut
      setUser(null); // Clear UserContext
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setSnackbar({ open: true, message: 'Failed to logout.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          height: '80vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* User Information Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}
                  src={ undefined }
                >
                  {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Typography variant="h6">User Information</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                <strong>Name:</strong> {currentUser?.displayName || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Email:</strong> {currentUser?.email || 'N/A'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Family Code:</strong> {familyCode}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Edit />}
                sx={{ mt: 2 }}
                onClick={handleOpenEditProfile}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Edit Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Family Information Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <FamilyRestroom sx={{ mr: 2, color: 'secondary.main', fontSize: 30 }} />
                <Typography variant="h6">Family Information</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                <strong>Family Name:</strong> {familyName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Family Code:</strong> {familyCode}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Edit />}
                sx={{ mt: 2 }}
                onClick={handleOpenChangeFamilyCode}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Change Family Code'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications sx={{ mr: 2, color: 'primary.main', fontSize: 30 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={handleToggleNotification}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Save />}
                sx={{ mt: 2 }}
                onClick={handleSaveNotificationSettings}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Update Password Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Lock sx={{ mr: 2, color: 'primary.main', fontSize: 30 }} />
                <Typography variant="h6">Update Password</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Change your account password securely.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Edit />}
                sx={{ mt: 2 }}
                onClick={handleOpenUpdatePassword}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Log Out Button */}
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleLogout}
        startIcon={<Lock />}
        disabled={actionLoading}
      >
        {actionLoading ? <CircularProgress size={24} /> : 'Log Out'}
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfile} onClose={handleCloseEditProfile}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Display Name"
            type="text"
            fullWidth
            variant="standard"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfile}>Cancel</Button>
          <Button onClick={handleEditProfile} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Password Dialog */}
      <Dialog open={openUpdatePassword} onClose={handleCloseUpdatePassword}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="standard"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdatePassword}>Cancel</Button>
          <Button onClick={handleUpdatePassword} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={openNotificationSettings} onClose={handleCloseNotificationSettings}>
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.email}
                onChange={handleToggleNotification}
                color="primary"
              />
            }
            label="Email Notifications"
          />
          {/* Add more notification preferences here if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotificationSettings}>Cancel</Button>
          <Button onClick={handleSaveNotificationSettings} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Family Code Dialog */}
      <Dialog open={openChangeFamilyCode} onClose={handleCloseChangeFamilyCode}>
        <DialogTitle>Change Family Code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Family Code"
            type="text"
            fullWidth
            variant="standard"
            value={newFamilyCode}
            onChange={(e) => setNewFamilyCode(e.target.value)}
            helperText="Family code must be 6 alphanumeric characters."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangeFamilyCode}>Cancel</Button>
          <Button onClick={handleChangeFamilyCode} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Change'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Profile;