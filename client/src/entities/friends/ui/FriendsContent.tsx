'use client';
import { Box, Modal, Typography } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Button from '@/shared/components/UI/Button';
import AddFriends from './AddFriends';
import FriendsList from '@/entities/friends/ui/FriendsList';
import useFriendsQuery from '@/entities/friends/api/useFriendsQuery';
import { socketClient } from '@/shared/lib/socket';
import { useUserStore } from '@/app/store/user-store';
import { useEffect, useState } from 'react';

type FriendsFilter = 'all' | 'online' | 'pending';

export default function FriendsContent() {
  const [selectedList, setList] = useState<FriendsFilter>('all');
  const [isAddFriendOpen, setAddFriendOpen] = useState(false);
  const { friends, isLoading } = useFriendsQuery();
  const { onlineFriends } = useUserStore((state) => state);

  useEffect(() => {
    if (friends) socketClient.emit('friendsSessions', friends?.all);
  }, [friends]);

  const segments: { key: FriendsFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: friends?.all?.length },
    { key: 'online', label: 'Online', count: onlineFriends?.length },
    { key: 'pending', label: 'Pending', count: friends?.pending?.length },
  ];

  return (
    <Box
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      px={3}
      py={2.5}
      gap={2}
    >
      {/* .page-head */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={700}>
          Friends
        </Typography>
        <Button
          variant="solid"
          onClick={() => setAddFriendOpen(true)}
          startIcon={<PersonAddAltOutlinedIcon/>}
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
          sx={(theme) => ({
            background: theme.palette.surface.elevated,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 999,
            p: 0.4,
          })}
        >
          {segments.map((segment) => {
            const active = selectedList === segment.key;
            return (
              <Box
                key={segment.key}
                component="button"
                type="button"
                onClick={() => setList(segment.key)}
                sx={(theme) => ({
                  all: 'unset',
                  cursor: 'pointer',
                  px: 1.75,
                  py: 0.65,
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: active
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.secondary,
                  backgroundColor: active
                    ? theme.palette.primary.main
                    : 'transparent',
                  transition: 'background-color .15s, color .15s',
                })}
              >
                {segment.label}
                {typeof segment.count === 'number' ? ` (${segment.count})` : ''}
              </Box>
            );
          })}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={(theme) => ({
            width: 260,
            backgroundColor: theme.palette.surface.elevated,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: `${theme.radius.sm}px`,
            px: 1.5,
            py: 0.75,
            color: theme.palette.text.secondary,
          })}
        >
          <SearchOutlinedIcon sx={{ fontSize: 16 }} />
          <Box
            component="input"
            placeholder="Search friends"
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

      <FriendsList
        friends={friends}
        selectedList={selectedList}
        isLoading={isLoading}
      />

      <Modal
        open={isAddFriendOpen}
        onClose={() => setAddFriendOpen(false)}
        aria-labelledby="add-friend-title"
      >
        <AddFriends closeAddFriendForm={() => setAddFriendOpen(false)} />
      </Modal>
    </Box>
  );
}
