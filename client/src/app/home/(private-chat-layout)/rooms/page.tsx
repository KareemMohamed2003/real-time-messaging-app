'use client';
import { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useUserStore } from '@/app/store/user-store';
import useRooms from '@/entities/rooms/api/useRooms';
import CreateRoomForm from '@/entities/rooms/ui/CreateRoomForm';
import RoomCard from '@/entities/rooms/ui/RoomCard';
import Button from '@/shared/components/UI/Button';
import { RoomCardSkeleton } from '@/shared/components/UI/Skeletons';

export default function Rooms() {
  const { uuid } = useUserStore((state) => state.profile!);
  const { rooms, isLoading } = useRooms(uuid!);
  const [displayForm, setDisplayForm] = useState(false);
  const closeRoomForm = () => setDisplayForm(false);
  const openRoomForm = () => setDisplayForm(true);

  return (
    <Box height="100%" width="100%" sx={{ overflowY: 'auto' }}>
      <Box px={4} py={3.25}>
        {/* .page-head */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
          mb={2.5}
        >
          <Typography variant="h5" fontWeight={700}>
            Rooms
          </Typography>
          <Button
            variant="solid"
            onClick={openRoomForm}
            startIcon={<AddRoundedIcon sx={{ fontSize: 15 }} />}
          >
            Create room
          </Button>
        </Box>

        {/* .toolbar-row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1.75}
          flexWrap="wrap"
          mb={2.25}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={(theme) => ({
              width: 280,
              backgroundColor: theme.palette.surface.elevated,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${theme.radius.sm}px`,
              px: 1.5,
              py: 0.5,
              color: theme.palette.text.secondary,
            })}
          >
            <SearchOutlinedIcon sx={{ fontSize: 15 }} />
            <Box
              component="input"
              placeholder="Search rooms"
              sx={{
                border: 0,
                outline: 'none',
                background: 'transparent',
                font: 'inherit',
                fontSize: 13,
                color: 'inherit',
                width: '100%',
              
              }}
            />
          </Box>
        </Box>

      
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {isLoading ? (
            <RoomCardSkeleton count={4} />
          ) : (
            rooms?.map((room: any) => (
              <RoomCard
                key={room.roomUUID}
                roomName={room.roomName}
                roomUUID={room.roomUUID}
                icon={room.icon}
              />
            ))
          )}
        </Box>
      </Box>

      <Modal
        open={displayForm}
        onClose={closeRoomForm}
        aria-labelledby="create-room-title"
      >
        <CreateRoomForm closeRoomForm={closeRoomForm} />
      </Modal>
    </Box>
  );
}
