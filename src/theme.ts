// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // You can switch to 'dark' mode if preferred
    primary: {
      main: '#90caf9', // Soft Blue
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ce93d8', // Soft Purple
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Light Gray
      paper: '#ffffff',    // Cards and surfaces
    },
    text: {
      primary: '#424242',   // Dark Gray
      secondary: '#757575', // Medium Gray
    },
  },
  shape: {
    borderRadius: 16, // Rounded corners for components
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;