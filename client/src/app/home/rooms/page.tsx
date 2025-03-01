'use client';
import React, { useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import RoomsIcon from '@/components/icons/RoomsIcon';
import AddRoomIcon from '@/components/icons/AddRoom';
import RoomLink from '@/components/RoomLink';
import slack from '../../../components/icons/svg/slack.png';
import ts from '../../../components/icons/svg/ts.png';
import nextjs from '../../../components/icons/svg/nextJs.png';
import CreateRoomForm from '@/components/CreateRoomForm';
import Portal from '@/components/Portal';
import { grey } from '@/app/lib/constants';
export default function Rooms() {
  const [displayForm, setDisplayForm] = useState(false);

  return (
    <Box
      display={'flex'}
      height={'100%'}
      width={'100%'}
      flexDirection={'column'}
      gap={4}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        p={1}
        width={'100%'}
        gap={3}
        sx={{ background: grey }}
      >
        <RoomsIcon height={60} width={60} />
        <Typography variant={'h6'} fontWeight={500}>
          rooms
        </Typography>
      </Box>

      <Button
        onClick={() => {
          setDisplayForm(!displayForm);
        }}
        sx={{
          borderRadius: '16px',
          textTransform: 'lowercase',
          alignSelf: 'start',
          background:
            'linear-gradient(0deg, rgba(5,87,163,1) 0%, rgba(47,149,245,1) 100%);',
          marginLeft: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontSize: '1.2rem',
        }}
        variant={'contained'}
      >
        create room
        <AddRoomIcon height={30} width={30} />
      </Button>
      {displayForm && (
        <Portal>
          <CreateRoomForm setDisplayForm={setDisplayForm} />
        </Portal>
      )}
      <Stack flexDirection={'column'} sx={{ marginLeft: 3, gap: 4 }}>
        {/* render rooms */}
        <RoomLink roomName={'slack'} image={slack.src} />
        <RoomLink roomName={'typescript'} image={ts.src} />
        <RoomLink roomName={'nextJs'} image={nextjs.src} />
        {/*<RoomLink roomName={"slack"} image={slack.src}/>*/}
      </Stack>
    </Box>
  );
}
