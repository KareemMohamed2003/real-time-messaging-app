'use client';
import { Roboto } from 'next/font/google';
import { createTheme, useTheme, makeStyles } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const mainStyles = {
  mainGradient:
    'linear-gradient(360deg, rgba(17,21,25,1) 0%, rgba(35,39,46,1) 100%)',
};

export const styles = (theme: any) => ({
  // root: {
  //     fontSize: 10,
  //     padding: themes.spacing(1),
  //
  //     [themes.breakpoints.down('md')]: {
  //         backgroundColor: themes.palette.secondary.main,
  //     },
  //     [themes.breakpoints.up('md')]: {
  //         backgroundColor: themes.palette.primary.main,
  //     },
  // },

  MuiTypography: {
    [theme.breakpoints.down('lg')]: {
      fontSize: 30,
    },
    fontSize: 30,
    h5: {
      [theme.breakpoints.down('lg')]: {
        backgroundColor: 'black',
      },
    },
    background: 'rgba(255,255,255,0.07)',
  },
});

const defaultTheme = createTheme({
  components: {
    MuiStack: {
      styleOverrides: {
        root: {
          // background: "linear-gradient(360deg, rgba(17,21,25,1) 0%, rgba(35,39,46,1) 100%)",
          '@media (min-width:600px)': {
            // fontSize: '1.5rem',
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#17191C',
    },
  },
});
// defaultTheme.typography
// default breakpoints values
// xs: 0,
// sm: 600,
// md: 900,
// lg: 1200,
// xl: 1536
const createRoomStyles = console.log(styles(defaultTheme));
const themes = createTheme();

// themes.typography.h3 = {
//     fontSize: '1.2rem',
//     '@media (min-width:600px)': {
//         fontSize: '1.5rem',
//     },
//     [themes.breakpoints.up('md')]: {
//         fontSize: '2.4rem',
//     },
// };

export default defaultTheme;
