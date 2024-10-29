import {
  AccountCircle as AccountCircleIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Home as HomeIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import AddTask from "./pages/AddTask";
import { CustomUser } from "./types";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import TaskOverview from "./pages/TaskOverview";
import { onAuthStateChangedListener } from "./services/authService";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#191919",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
});

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleTaskAdded = (taskName: string) => {
    console.log("Task added:", taskName);
  };

  // Determine if navigation should be shown
  const showNavigation =
    currentUser &&
    location.pathname !== "/login" &&
    location.pathname !== "/signup";

  if (isLoading) {
    // Display a loading spinner while authentication state is loading
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Remove the Router wrapping here */}
      {/* Top App Bar */}
      {showNavigation && (
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Family Assistant
            </Typography>
            {/* You can add a user avatar or settings icon here */}
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box
        sx={{
          paddingTop: showNavigation ? "64px" : 0,
          paddingBottom: showNavigation ? "56px" : 0,
          minHeight: "100vh",
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        <Routes>
          {/* Unauthenticated Routes */}
          {!currentUser && (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          {/* Authenticated Routes */}
          {currentUser && (
            <>
              <Route path="/" element={<Home />} />
              <Route
                path="/tasks"
                element={<TaskOverview familyId={currentUser.familyId} />}
              />
              <Route
                path="/add-task"
                element={<AddTask onTaskAdded={handleTaskAdded} />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Box>

      {/* Bottom Navigation Bar */}
      {showNavigation && (
        <BottomNavigation
          showLabels
          value={location.pathname}
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
            backgroundColor: "background.paper",
          }}
        >
          <BottomNavigationAction
            component={Link}
            to="/"
            label="Home"
            icon={<HomeIcon />}
            value="/"
          />
          <BottomNavigationAction
            component={Link}
            to="/tasks"
            label="Tasks"
            icon={<ListAltIcon />}
            value="/tasks"
          />
          <BottomNavigationAction
            component={Link}
            to="/add-task"
            label="Add Task"
            icon={<AddCircleOutlineIcon />}
            value="/add-task"
          />
          <BottomNavigationAction
            component={Link}
            to="/profile"
            label="Profile"
            icon={<AccountCircleIcon />}
            value="/profile"
          />
        </BottomNavigation>
      )}
    </ThemeProvider>
  );
};

export default App;