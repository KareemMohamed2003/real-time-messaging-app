'use client';

import { useParams } from 'next/navigation';
import { useUserStore } from '@/app/store/use-user-store';
import FriendConversation from '@/widgets/friend-conversation/ui/FriendConversation';

export default function PrivateChat() {
  const dynamicParam = useParams<{ friendId: string }>();
  const friendId = dynamicParam.friendId;
  const { profile } = useUserStore(state => state);

  return <FriendConversation currentUserUUID={profile.uuid} friendUUID={friendId} />;
}
