import { createTheme } from '@mui/material/styles';

const paper = '#faf7f2';
const surface = '#f3ede3';
const ink = '#262220';
const inkMuted = '#6f645c';
const rule = '#ddd2c4';
const terracotta = '#b5533c';
const terracottaDark = '#8f3f2d';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: terracotta,
      dark: terracottaDark,
      contrastText: '#fff8f2',
    },
    secondary: { main: inkMuted },
    info: { main: '#87ceeb', contrastText: '#fff8f2' },
    error: { main: '#ff6700', contrastText: '#fff8f2' },
    background: { default: paper, paper: surface },
    text: { primary: ink, secondary: inkMuted },
    divider: rule,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 },
    h5: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 },
    h6: { fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 500 },
    button: { fontWeight: 500, textTransform: 'none' },
  },
  shadows: Array(25).fill('none') as any,
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: paper,
          color: ink,
          borderBottom: `1px solid ${rule}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: surface,
          borderRight: `1px solid ${rule}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: 'none', borderRadius: 4 },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: `1px solid ${rule}`,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${rule}`,
          borderRadius: 4,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: `1px solid ${rule}`,
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: {
        root: { display: 'none' },
      },
    },
  },
});
