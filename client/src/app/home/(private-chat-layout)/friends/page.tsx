'use client';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Button from '@/shared/components/UI/Button';
import FriendsList from '@/entities/friends/ui/FriendsList';
import UseSuspenseFriendsQuery from '@/entities/friends/api/useSuspenseFriendsQuery';
import { socketClient } from '@/shared/lib/socket';
import { useUserStore } from '@/app/store/user-store';
import { useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '@/shared/lib/constants';
import { Box, Typography } from '@mui/material';
import AddFriends from '@/entities/friends/ui/AddFriends';
import Input from '@/shared/components/UI/Input';
import { useQuery } from '@tanstack/react-query';
import { getFriendsQuery } from '@/shared/api/queries';
import { friendsKeys } from '@/shared/api/QueryKeys';
type FriendsFilter = 'all' | 'online' | 'pending';
export default function FriendsPage() {
  const [selectedList, setList] = useState<FriendsFilter>('all');
  const [isAddFriendOpen, setAddFriendOpen] = useState(false);
  const { data: friends, isLoading } = useQuery({
    queryKey: friendsKeys.defaultKey,
    queryFn: () => getFriendsQuery(),
  });
  const { onlineFriends } = useUserStore(state => state);
  console.log(friends, isLoading);
  useEffect(() => {
    // we are not updating online friends presence  this only works on first render or when friends changes
    if (friends) {
      socketClient.emit(SOCKET_EVENTS.ONLINE_FRIENDS, friends?.all);
      console.log(friends);
    }
  }, [friends]);

  const segments: { key: FriendsFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: friends?.all?.length },
    { key: 'online', label: 'Online', count: onlineFriends?.length },
    { key: 'pending', label: 'Pending', count: friends?.pending?.length },
  ];

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column" px={3} py={2.5} gap={2}>
      {/* .page-head */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>
          Friends
        </Typography>
        <Button
          variant="solid"
          onClick={() => setAddFriendOpen(true)}
          startIcon={<PersonAddAltOutlinedIcon />}
        >
          Add friend
        </Button>
      </Box>

      {/* .toolbar-row */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1.5}
      >
        <Box
          display="flex"
          sx={theme => ({
            background: theme.palette.surface.elevated,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 999,
            p: 0.4,
          })}
        >
          {segments.map(segment => {
            const active = selectedList === segment.key;
            return (
              <Box
                key={segment.key}
                component="button"
                type="button"
                onClick={() => setList(segment.key)}
                sx={theme => ({
                  all: 'unset',
                  cursor: 'pointer',
                  px: 1.75,
                  py: 0.65,
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                  backgroundColor: active ? theme.palette.primary.main : 'transparent',
                  transition: 'background-color .15s, color .15s',
                })}
              >
                {segment.label}
                {typeof segment.count === 'number' ? ` (${segment.count})` : ''}
              </Box>
            );
          })}
        </Box>
        <Box>
          <Input
            InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ fontSize: 16 }} /> }}
            placeholder="Search friends"
          />
        </Box>
      </Box>

      <FriendsList friends={friends} selectedList={selectedList} isLoading={isLoading} />
      <AddFriends closeAddFriendForm={() => setAddFriendOpen(false)} open={isAddFriendOpen} />
    </Box>
  );
}
