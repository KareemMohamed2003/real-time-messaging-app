import { IRoomMember } from '@/shared/types/api.types';
import { useMemo, useCallback, useState } from 'react';
import useRoomMembers from '@/entities/rooms/api/useRoomMembers';
import UseFriendsQuery from '@/entities/friends/api/useSuspenseFriendsQuery';
import useAddRoomMemberMutation from '@/features/add-room-member/api/useAddRoomMemberMutation';
import { IAddableRoomMember } from './types';

interface UseAddRoomMemberOptions {
  roomUUID: string;
  onClose: () => void;
  onInviteByTag?: (tag: string) => void;
}

export default function useAddRoomMembers({
  roomUUID,
  onClose,
  onInviteByTag,
}: UseAddRoomMemberOptions) {
  const { friends, isLoading } = UseFriendsQuery();
  // refactor this code if possible
  const userFriends: IAddableRoomMember[] = friends?.all;
  const { addableFriends } = useRoomMembers(roomUUID, userFriends);
  const { isPending, isError, mutate, isSuccess } = useAddRoomMemberMutation(roomUUID);
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Map<string, IAddableRoomMember>>(() => new Map());
  const [tagValue, setTagValue] = useState('');
  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return addableFriends;
    return addableFriends.filter(m => m.username.toLowerCase().includes(q));
  }, [query, addableFriends]);

  const toggleMember = useCallback((id: string, addableRoomMember: IAddableRoomMember) => {
    setSelectedIds(prev => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, addableRoomMember);
      }
      return next;
    });
  }, []);

  const handleDone = useCallback(() => {
    const selectedList = Array.from(selectedIds.values());
    const normalizedMembers: IRoomMember[] = selectedList.map(newMember => ({
      roomUUID,
      userId: newMember.uuid,
      role: 'MEMBER',
    }));
    mutate(normalizedMembers, {
      onSuccess() {
        setSelectedIds(new Map());
      },
    });
  }, [onClose, selectedIds]);

  const handleInvite = useCallback(() => {
    const tag = tagValue.trim();
    if (!tag) return;
    onInviteByTag?.(tag);
    setTagValue('');
  }, [tagValue, onInviteByTag]);

  return {
    handleInvite,
    handleDone,
    toggleMember,
    filteredMembers,
    addableFriends,
    isPending,
    isError,
    mutate,
    isSuccess,
    query,
    setQuery,
    selectedIds,
    setSelectedIds,
    tagValue,
    setTagValue,
  };
}
