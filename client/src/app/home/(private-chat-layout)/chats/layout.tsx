'use client';

import { useUserStore } from '@/app/store/use-user-store';
import { getRecentConversations } from '@/shared/api/queries';
import { userKeys } from '@/shared/api/QueryKeys';
import { DmListSkeleton } from '@/shared/components/UI/Skeletons';
import { IDirectMessage } from '@/shared/types/api.types';
import DmList from '@/widgets/dm-list/ui/DmList';
import { Box, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useState } from 'react';
interface props {
  children: React.ReactNode;
}
export default function ChatLayout({ children }: props) {

  const [selectedConversation, onSelectConversation] = useState<string>('');
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
      <>{children}</>
    </Box>
  );
}
