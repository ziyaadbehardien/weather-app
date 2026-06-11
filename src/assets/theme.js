import { createTheme } from '@mui/material/styles';

const BLACK = '#0B0B0D';
const PAPER = '#141417';
const YELLOW = '#FFD60A';
const LIGHT_YELLOW = '#FFE566';
const CREAM = '#F5F0DC';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: YELLOW, contrastText: '#000000' },
    secondary: { main: LIGHT_YELLOW, contrastText: '#000000' },
    background: { default: BLACK, paper: PAPER },
    text: {
      primary: CREAM,
      secondary: 'rgba(245, 240, 220, 0.65)',
    },
    divider: 'rgba(255, 214, 10, 0.15)',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 214, 10, 0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 214, 10, 0.08)',
        },
      },
    },
  },
});

export default theme;
