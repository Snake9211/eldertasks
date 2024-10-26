import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import AddTask from "./pages/AddTask";
import Home from "./pages/Home";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TaskOverview from "./pages/TaskOverview";
import { User } from "firebase/auth";
import { onAuthStateChangedListener } from "./services/authService";
import { useFamilyContext } from "./context/FamilyContext";

const App: React.FC = () => {
  const { familyId } = useFamilyContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state for auth
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      setIsLoading(false); // Set loading to false after auth state is determined
    });
    return unsubscribe;
  }, []);

  const handleTaskAdded = (taskName: string) => {
    console.log("Task added:", taskName);
  };

  // Check if the current route is the login page to conditionally hide the navigation
  const showNavigation = currentUser && location.pathname !== "/login";

  if (isLoading) {
    // Optional: Display a loading spinner or splash screen while loading
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/tasks" element={currentUser ? <TaskOverview familyId={familyId} /> : <Navigate to="/login" replace />} />
        <Route path="/add-task" element={currentUser ? <AddTask onTaskAdded={handleTaskAdded} /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
      </Routes>

      {/* Bottom Navigation Bar, visible only when logged in and not on the login page */}
      {showNavigation && (
        <BottomNavigation showLabels style={{ position: "fixed", bottom: 0, width: "100%" }}>
          <BottomNavigationAction component={Link} to="/" label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction component={Link} to="/tasks" label="Tasks" icon={<ListAltIcon />} />
          <BottomNavigationAction component={Link} to="/add-task" label="Add Task" icon={<AddIcon />} />
          <BottomNavigationAction component={Link} to="/profile" label="Profile" icon={<AccountCircleIcon />} />
        </BottomNavigation>
      )}
    </div>
  );
};

export default App;