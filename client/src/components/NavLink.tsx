import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface INavLink {
  Icon: any;
  href: string;
  name: string;
}

export function NavLink({ Icon, href, name }: INavLink) {
  {
    /* when the screen size is 1600px+ in size we should make the fontSize around 1.4rem or h5 variant 
                the icons should be around 55 px for width, height . 
                */
  }

  const router = useRouter();
  return (
    <div
      style={{ width: '100%' }}
      onClick={() => {
        if (name == 'logout') {
          localStorage.removeItem('user_s_ts');
        }
        router.push(href);
      }}
    >
      <Box
        sx={{
          ':hover': {
            cursor: 'pointer',
            color: '#1794BB',
          },
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 2,
          borderRadius: '10px',
        }}
      >
        <Box marginLeft={'8px'}>
          <Icon width={40} height={40} />
        </Box>

        <Typography fontWeight={'bold'} fontSize={'1.1rem'}>
          {name}
        </Typography>
      </Box>
    </div>
  );
}
