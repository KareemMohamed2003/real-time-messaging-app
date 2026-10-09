'use client';
import { Suspense, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { DmListSkeleton } from '@/shared/components/UI/Skeletons';
import DmList from '@/widgets/dm-list/ui/DmList';
import FriendConversation from '@/widgets/friend-conversation/ui/FriendConversation';
import EmptyChatsState from '@/shared/components/UI/EmptyChatsState';
import { useUserStore } from '@/app/store/use-user-store';
import { useQuery } from '@tanstack/react-query';
import { getRecentConversations } from '@/shared/api/queries';
import { userKeys } from '@/shared/api/QueryKeys';
import { IDirectMessage } from '@/shared/types/api.types';

export default function ChatsPage() {
  const profile = useUserStore(state => state.profile);
  const { data: conversations, isLoading } = useQuery<IDirectMessage[]>({
    queryKey: userKeys.recentDMs,
    queryFn: getRecentConversations,
  });
  const [selectedConversation, onSelectConversation] = useState<string>('');
  const hasConversations = conversations?.length! > 0;
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
        <EmptyChatsState
          variant={
            isLoading ? 'no-selection' : hasConversations ? 'no-selection' : 'no-conversations'
          }
        />
      ) : (
        <FriendConversation friendUUID={selectedConversation} currentUserUUID={profile.uuid} />
      )}
    </Box>
  );
}
