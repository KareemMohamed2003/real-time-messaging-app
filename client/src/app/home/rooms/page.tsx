'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Portal } from '@mui/material';
import slack from '../../../components/icons/svg/slack.png';
import ts from '../../../components/icons/svg/ts.png';
import nextjs from '../../../components/icons/svg/nextJs.png';
import { useUserStore } from '@/app/store/user-store';
import useRooms from '@/entities/rooms/api/useRooms';
import CreateRoomForm from '@/entities/rooms/ui/CreateRoomForm';
import RoomLink from '@/entities/rooms/ui/RoomLink';
import AddRoomIcon from '@/shared/components/icons/AddRoom';
import RoomsIcon from '@/shared/components/icons/RoomsIcon';
import { togglePortalEffect } from '@/shared/lib/utils';
import { mainStyles } from '@/themes';
export default function Rooms() {
  const { uuid } = useUserStore((state) => state.profile!);
  const { rooms } = useRooms(uuid!);
  const [displayForm, setDisplayForm] = useState(false);
  const closeRoomForm = () => {
    setDisplayForm(!displayForm);
    togglePortalEffect();
  };
  console.log('rooms', rooms);
  return (
    <Box
      height={'100%'}
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      gap={4}
      sx={{ overflowY: 'auto', flexGrow: 1 }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        p={1}
        px={4}
        width={'100%'}
        gap={3}
      >
        <RoomsIcon height={60} width={60} />
        <Typography variant={'h6'} fontWeight={500}>
          rooms
        </Typography>
      </Box>
      <Button
        onClick={() => setDisplayForm(!displayForm)}
        sx={{
          borderRadius: '16px',
          textTransform: 'lowercase',
          alignSelf: 'start',
          background: mainStyles.mainBlue,
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
          <CreateRoomForm closeRoomForm={closeRoomForm} />
        </Portal>
      )}
      <Grid
        container
        px={4}
        spacing={2}
        rowSpacing={5}
        sx={{ alignItems: 'center' }}
      >
        {/* render rooms */}
        {rooms?.map((el, index) => (
          <Grid item xs={6} key={index}>
            <RoomLink roomName={el.room.roomName} icon={el.icon} />
          </Grid>
        ))}
        {/* <RoomLink roomName={'slack'} image={slack.src} />
        <RoomLink roomName={'typescript'} image={ts.src} />
        <RoomLink roomName={'nextJs'} image={nextjs.src} /> */}
        {/*<RoomLink roomName={"slack"} image={slack.src}/>*/}
        {/* </Stack> */}
      </Grid>
    </Box>
  );
}
