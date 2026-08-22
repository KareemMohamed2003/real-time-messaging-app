'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Modal } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import useRooms from '@/entities/rooms/api/useRooms';
import CreateRoomForm from '@/entities/rooms/ui/CreateRoomForm';
import RoomLink from '@/entities/rooms/ui/RoomLink';
import AddRoomIcon from '@/shared/components/icons/AddRoom';
import RoomsIcon from '@/shared/components/icons/RoomsIcon';
import { mainStyles } from '@/themes';

export default function Rooms() {
  const { uuid } = useUserStore((state) => state.profile!);
  const { rooms } = useRooms(uuid!);
  const [displayForm, setDisplayForm] = useState(false);
  const closeRoomForm = () => setDisplayForm(false);
  const openRoomForm = () => setDisplayForm(true);

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
        onClick={openRoomForm}
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

      <Modal
        open={displayForm}
        onClose={closeRoomForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreateRoomForm closeRoomForm={closeRoomForm} />
      </Modal>

      <Grid
        container
        px={4}
        spacing={2}
        rowSpacing={5}
        sx={{ alignItems: 'center' }}
      >
        {/* render rooms */}
        {rooms?.map((el: any, index: number) => (
          <Grid item xs={6} key={index}>
            <RoomLink
              roomName={el.roomName}
              roomUUID={el.roomUUID}
              icon={el.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
