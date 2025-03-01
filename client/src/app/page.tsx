import { Typography } from '@mui/material';

// material ui default fonts
// <link
//     rel="stylesheet"
//     href="https://fonts.googleapis.com/icon?family=Material+Icons"
// />

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography
        variant={'h2'}
        sx={{
          backgroundImage:
            'linear-gradient(90deg, rgba(129,130,130,1) 0%, rgba(45,45,45,1) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        fontWeight="bold"
      >
        this page will be used to decide which page to render based on whether
        the user is authenticated or not
      </Typography>
    </main>
  );
}
