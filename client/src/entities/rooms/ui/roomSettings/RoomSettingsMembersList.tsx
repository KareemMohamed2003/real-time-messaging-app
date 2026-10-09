import { Box } from '@mui/material';
import GroupLabel from './GroupLabel';
import MemberRow from './MemberRow';
import useRoomMembers from '@/entities/rooms/api/useRoomMembers';
import { useUserStore } from '@/app/store/use-user-store';
import { RowSkeleton } from '@/shared/components/UI/Skeletons';

// ---------------------------------------------------------------------------
// Members list — grouped by role, Kick on non-owners only
// ---------------------------------------------------------------------------
interface props {
  roomUUID: string;
  isOwner: boolean;
}
export default function RoomSettingsMembersList({ roomUUID, isOwner }: props) {
  const { roomMembers, isLoading } = useRoomMembers(roomUUID, []);
  const owners = roomMembers?.filter(m => m.role === 'OWNER');
  const others = roomMembers?.filter(m => m.role !== 'OWNER');
  const { uuid } = useUserStore(state => state.profile);
  if (isLoading) <RowSkeleton count={5} />;
  return (
    <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, mx: -0.75, px: 0.75 }}>
      {owners?.length > 0 && (
        <>
          <GroupLabel first>Admin — {owners.length}</GroupLabel>
          {owners.map((m, i) => (
            <MemberRow
              key={m.userId}
              member={m}
              roomUUID={roomUUID}
              kickable={false}
              first={i === 0}
            />
          ))}
        </>
      )}
      {roomMembers?.length > 0 && (
        <>
          <GroupLabel first={owners.length === 0}>Members — {others.length}</GroupLabel>
          {others?.map((m, i) => (
            <MemberRow
              key={m.userId}
              member={m}
              roomUUID={roomUUID}
              kickable={isOwner}
              first={i === 0}
            />
          ))}
        </>
      )}
    </Box>
  );
}
