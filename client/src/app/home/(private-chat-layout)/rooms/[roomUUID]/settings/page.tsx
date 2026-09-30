'use client';
import { AppRoutes } from '@/shared/lib/utils';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RowSkeleton } from '@/shared/components/UI/Skeletons';
import SettingsCard from '@/entities/rooms/ui/SettingsCard';
import UseRoom from '@/entities/rooms/api/useRoom';
import RoomSettingsMembersList from '@/entities/rooms/ui/roomSettings/RoomSettingsMembersList';
import DeleteRoomButton from '@/entities/rooms/ui/roomSettings/DeleteRoomButton';
import RoomProfileCard from '@/entities/rooms/ui/roomSettings/RoomProfileCard';
import { useUserStore } from '@/app/store/use-user-store';
import ChannelsSettingsSection from '@/widgets/channel-settings/ui/ChannelsSettingsSection';
import RoomAccessCard from '@/entities/rooms/ui/roomSettings/RoomAccessCard';

export default function RoomSettingsPage() {
  const { roomUUID } = useParams<{ roomUUID: string }>();
  const { uuid } = useUserStore(state => state.profile);
  const router = useRouter();
  const room = UseRoom(roomUUID);
  const isRoomOwner = room?.ownerId === uuid;

  return (
    <Box p={{ xs: 2, md: 3.5 }} sx={{ overflowY: 'scroll' }} width={'100%'}>
      <Box display="flex" gap={1.5} mb={2} flex={1} alignItems={'center'}>
        <IconButton
          aria-label="Back to room"
          onClick={() => router.push(AppRoutes.ROOM_ROUTE(roomUUID))}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" fontWeight={700} fontSize={19}>
          {room ? `${room.roomName} settings` : 'Room settings'}
        </Typography>
      </Box>

      <Box
        display="grid"
        gap={2.5}
        alignItems="stretch"
        sx={{ gridTemplateColumns: { xs: '1fr', md: '40% 25%' } }}
      >
        {/* main column */}
        <Stack minWidth={0} gap={2}>
          {!room ? (
            <SettingsCard title="Room profile">
              <RowSkeleton count={2} />
            </SettingsCard>
          ) : (
            <RoomProfileCard isOwner={isRoomOwner} room={room} roomUUID={roomUUID} />
          )}
          {/*  display later when we implement room links  */}
          {/* {room && <RoomAccessCard room={room} roomUUID={roomUUID} />} */}
          {isRoomOwner && (
            <>
              <SettingsCard
                title="Danger zone"
                danger
                description="Deleting a room removes it and its messages for everyone. This can't be undone."
              >
                <DeleteRoomButton roomUUID={roomUUID} roomName={room?.roomName} />
              </SettingsCard>
              <ChannelsSettingsSection roomUUID={roomUUID} />
            </>
          )}
        </Stack>

        {/* side column — same height as the main column via `alignItems="stretch"` + SettingsCard's fillHeight, so Members lines up with Danger zone at the bottom */}
        <Box display="flex" flexDirection="column">
          <SettingsCard
            title="Members"
            description={
              // room
              // ? `${room.} member${room.members.length === 1 ? '' : 's'} in this room.`
              // :
              undefined
            }
            fillHeight
          >
            <RoomSettingsMembersList isOwner={isRoomOwner} roomUUID={roomUUID} />
          </SettingsCard>
        </Box>
      </Box>
    </Box>
  );
}
