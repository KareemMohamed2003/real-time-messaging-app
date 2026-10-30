'use client';
import { useState } from 'react';
import { Box, InputAdornment,  Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useUserStore } from '@/app/store/use-user-store';
import useRooms from '@/entities/rooms/api/useRooms';
import CreateRoomForm from '@/entities/rooms/ui/CreateRoomForm';
import RoomCard from '@/entities/rooms/ui/RoomCard';
import Button from '@/shared/components/UI/Button';
import { RoomCardSkeleton } from '@/shared/components/UI/Skeletons';
import Input from '@/shared/components/UI/Input';
import { IRoom } from '@/shared/types/api.types';
import useSearch from '@/shared/hooks/useSearch';

export default function Rooms() {
  const { uuid } = useUserStore(state => state.profile!);
  const { rooms, isLoading } = useRooms(uuid!);
  const [displayForm, setDisplayForm] = useState(false);
  const { filteredList: filteredRooms, setSearch } = useSearch(rooms!, 'roomName');

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
          flexWrap="wrap"
          mb={2.25}
        >
          <Box display="flex" alignItems="center">
            <Input
              onChange={v => setSearch(v.target.value)}
              placeholder="search rooms"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0, justifySelf: 'center' }}>
                    <SearchOutlinedIcon sx={{ fontSize: 17 }} />
                  </InputAdornment>
                ),
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
            filteredRooms?.map((room: IRoom) => (
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
      {displayForm && <CreateRoomForm open={displayForm} closeRoomForm={closeRoomForm} />}
    </Box>
  );
}
