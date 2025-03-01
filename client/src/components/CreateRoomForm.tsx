import { Box, Stack, Typography, FormControl } from '@mui/material';
import UploadIcon from '@/components/icons/UploadIcon';
import theme from '@/themes';
import { styles } from '@/themes';
import { ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { FormEvent } from 'react';
import Input from './Input';

import Button from './Button';
import { primaryBg } from '@/app/lib/constants';
export default function CreateRoomForm({ setDisplayForm }: any) {
  const defaultTheme = styles(theme);
  console.log(defaultTheme);
  return (
    <ThemeProvider theme={theme}>
      <Stack
        zIndex={10}
        height={'16rem'}
        width={'30%'}
        borderRadius={'17px'}
        position={'absolute'}
        spacing={3}
        padding={2}
        sx={{
          background: primaryBg,
        }}
      >
        <CloseIcon
          onClick={() => {
            setDisplayForm(false);
            document
              .querySelector('#portal')
              ?.classList.remove('portal-effect');
          }}
          sx={{ color: 'white', alignSelf: 'end' }}
        />

        <Box
          display={'flex'}
          component="div"
          flexDirection={'column'}
          alignSelf={'center'}
          alignItems={'center'}
          width={'80%'}
          p={1}
          borderRadius={'14px'}
          sx={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <UploadIcon width={40} height={40} />
          <Typography fontWeight={'bold'}>upload image</Typography>
        </Box>
        {/*<FormControl  >*/}

        <Box
          component={'form'}
          display={'flex'}
          flexDirection={'column'}
          // justifyContent={"center"}
          alignItems={'center'}
          height={'100%'}
          gap={2}
          onSubmit={(event: FormEvent<HTMLFormElement>) => {}}
        >
          {/* <Input placeholder={"room name"} type={"text"}/> */}
          <Input type="text" placeholder="room name" />

          <Button
            variant="contained"
            css={{
              bgColor: '#13CB7E',
              p: '5px 20px',
              borderRadius: '18px',
            }}
          >
            create
          </Button>
        </Box>
        {/*</FormControl>*/}
      </Stack>
    </ThemeProvider>
  );
}
