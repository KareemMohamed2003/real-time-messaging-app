import { Box, Drawer, Stack, Typography, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import User from '@/shared/components/User';
import useRoomMembers from '../api/useRoomMembers';
import UseFriendsQuery from '@/entities/friends/api/useFriendsQuery';
import { IRoomMember } from '@/shared/types/api.types';

interface props {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  roomUUID: string;
}

/**
 * Rebuilt on MUI's Drawer rather than a hand-positioned, blurred Box.
 * The old version had no backdrop click-to-close, no Escape-key handling,
 * and no focus trap — Drawer gets all three for free,.
 */
export default function RoomMembers({ isOpen, setOpen, roomUUID }: props) {
  const { friends } = UseFriendsQuery();
  const { roomMembers } = useRoomMembers(roomUUID, friends?.all);
  console.log(roomMembers);
  console.log(friends);
  return (
    <Drawer anchor="right" open={isOpen} onClose={() => setOpen(false)}>
      <Box
        sx={(theme) => ({
          width: 320,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.surface.paper,
        })}
      >
        <Box
          px={2.5}
          py={2.25}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
          })}
        >
          <Typography fontWeight={700} fontSize={15.5}>
            Members
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Stack px={1.75} py={1.25} gap={3} sx={{ overflowY: 'auto' }} mt={1}>
          {roomMembers?.map((member: IRoomMember) => (
            <User
              name={member.user?.username!}
              profilePic={member.user?.profile_img!}
              status="away"
            />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
