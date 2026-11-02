'use client';
import { useUserStore } from '@/app/store/use-user-store';
import FriendConversation from '@/widgets/friend-conversation/ui/FriendConversation';
import { useParams } from 'next/navigation';

export default function ConversationPage() {
  const profile = useUserStore(state => state.profile);
  const param = useParams<{ friendUUID: string }>();
  const friendUUID = param.friendUUID;
  console.log(friendUUID);
  return <FriendConversation friendUUID={friendUUID} currentUserUUID={profile.uuid} />;
}
