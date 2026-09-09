'use client';
<<<<<<< Updated upstream
import { Box } from '@mui/material';
export default function Home() {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      height={'100%'}
      width={'80%'}
      mt={3}
      gap={5}
      alignItems={'center'}
    >
    <h1>chats page</h1>
=======
import { Suspense, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import { DmListSkeleton } from '@/shared/components/UI/Skeletons';
import DmList from '@/widgets/dm-list/ui/DmList';
import FriendConversation from '@/widgets/friend-conversation/ui/FriendConversation';
import EmptyChatsState from '@/shared/components/UI/EmptyChatsState';

export default function ChatsPage() {
  const [selectedConversation, onSelectConversation] = useState<string>('');
  const profile = useUserStore(state => state.profile);

  return (
    <Box sx={{ flex: 1, display: 'flex', height: '100%', width: '100%' }}>
      <Suspense
        fallback={
          <Stack>
            <DmListSkeleton />
          </Stack>
        }
      >
        <DmList
          activeFriendUUID={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </Suspense>

      {!selectedConversation ? (
        <EmptyChatsState variant={selectedConversation ? 'no-selection' : 'no-conversations'} />
      ) : (
        <FriendConversation friendUUID={selectedConversation} currentUserUUID={profile.uuid} />
      )}
>>>>>>> Stashed changes
    </Box>
  );
}
