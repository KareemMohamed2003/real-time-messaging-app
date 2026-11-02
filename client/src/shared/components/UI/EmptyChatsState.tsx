'use client';

import { Box, Typography } from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/UI/Button';
import { AppRoutes } from '@/shared/lib/utils';

export interface EmptyChatsStateProps {
  variant?: 'no-conversations' | 'no-selection';
}

export default function EmptyChatsState({ variant  }: EmptyChatsStateProps) {
  const router = useRouter();
  const isNoConversations = variant === 'no-conversations';

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.75,
        textAlign: 'center',
        p: 5,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 64,
          height: 64,
          borderRadius: `${theme.radius.lg}px`,
          backgroundColor: theme.palette.surface.elevated,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.text.disabled,
        })}
      >
        {isNoConversations ? (
          <ChatOutlinedIcon sx={{ fontSize: 30 }} />
        ) : (
          <ForumOutlinedIcon sx={{ fontSize: 30 }} />
        )}
      </Box>

      <Typography variant="subtitle1" fontWeight={700} fontSize={17}>
        {isNoConversations ? 'No conversations yet' : 'Select a conversation'}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
        {isNoConversations
          ? "When you message a friend, it'll show up here. Start by picking someone from your friends list."
          : 'Pick a conversation from the list on the left, or start a new one from your friends list.'}
      </Typography>

      {isNoConversations && (
        <Button
          onClick={() => router.push(AppRoutes.FRIENDS_ROUTE)}
          startIcon={<PersonAddAltOutlinedIcon sx={{ fontSize: 15 }} />}
        >
          Message a friend
        </Button>
      )}
    </Box>
  );
}
