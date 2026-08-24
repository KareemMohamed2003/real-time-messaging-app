'use client';
import {
  Container,
  Stack,
  ThemeOptions,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { sizing } from '@mui/system';
import theme from '@/themes(legacy)';
import { primaryBg } from '../shared/lib/constants';
// import Input from '@/components/input';
//  main-background color
// background: rgb(17,21,25);
// background: linear-gradient(90deg, rgba(17,21,25,1) 0%, rgba(35,39,46,1) 100%);

export default function Home() {
  const theme = useTheme();
  const matches = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
  console.log(matches);
  const styledStack = styled('div')(({ theme }) => ({
    height: '100%',
  }));

  const styles = (theme: any) => ({
    body: {
      padding: theme.spacing(1),
      [theme.breakpoints.down('md')]: {
        backgroundColor: '#ff0000',
      },
      [theme.breakpoints.up('md')]: {
        backgroundColor: theme.palette.primary.main,
      },
      // [theme.breakpoints.up('lg')]: {
      //     backgroundColor: green[500],
      // },
    },
  });

  //   const matches = useMediaQuery((theme:any) => theme.breakpoints.up('sm'));
  console.log(styles(theme));
  return (
    // <Stack sx={{height:"100%"}} justifyContent={"space-around"}>

    <Stack
      flexDirection={'column'}
      justifyContent="space-evenly"
      sx={{
        height: '100%',
        width: '20%',
        background: primaryBg,
      }}
      alignItems={'center'}
    >
      background: rgb(17,21,25);
      {/*background: linear-gradient(0deg, rgba(17,21,25,1) 0%, rgba(35,39,46,1) 100%);*/}
      #111519 #23272e
      {/*<Box sx={{background: "#FFF333" ,height:100,width:"100%"}}>item 1</Box>*/}
      {/*<Box sx={{background: "#105293",height:100,width:"100%"}}>item 1</Box>*/}
      {/*<Box sx={{background: "#105293",height:100 ,width:"100%"}}>item 1</Box>*/}
    </Stack>
    // </Stack>
  );
  {
    /*<Box  sx={{*/
  }
  {
    /*    width: {*/
  }
  {
    /*        xs: 100, // theme.breakpoints.up('xs')*/
  }
  {
    /*        sm: 200, // theme.breakpoints.up('sm')*/
  }
  {
    /*        md: 300, // theme.breakpoints.up('md')*/
  }
  {
    /*        lg: "70%", // theme.breakpoints.up('lg')*/
  }
  {
    /*        xl: "90%" // theme.breakpoints.up('xl')*/
  }
  {
    /*    }*/
  }
  {
    /*}} flexDirection={"column"} alignItems="center"*/
  }
  {
    /*     style={{background: "", height: "100%"}}>*/
  }
  {
    /*    <Input placeholder={"search"} type={"text"}/>*/
  }
  {
    /*    <Typography variant={"h2"} sx={{*/
  }
  {
    /*        backgroundImage: "linear-gradient(90deg, rgba(129,130,130,1) 0%, rgba(45,45,45,1) 100%)",*/
  }
  {
    /*        backgroundClip: "text",*/
  }
  {
    /*        WebkitBackgroundClip: "text",*/
  }
  {
    /*        WebkitTextFillColor: "transparent"*/
  }
  {
    /*    }} fontWeight="bold">*/
  }

  {
    /*        home page*/
  }
  {
    /*        down(up)*/
  }
  {
    /*    </Typography>*/
  }
  {
    /*    <div style={{color: "red"}}>*/
  }
  {
    /*        dsd*/
  }
  {
    /*        {matches}*/
  }
  {
    /*    </div>*/
  }
  {
    /* */
  }
  {
    /*</Box>*/
  }
}
