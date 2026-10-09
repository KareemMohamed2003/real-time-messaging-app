// ---------------------------------------------------------------------------
// Delete room
'use client';
import { useUserStore } from '@/app/store/use-user-store';import ConfirmDialog from '@/shared/components/UI/ConfirmDialog';
import useDeleteRoom from '@/features/delete-room';
import { DangerButton } from '@/shared/components/UI/Button';
import { AppRoutes } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ---------------------------------------------------------------------------
export default function DeleteRoomButton({
  roomUUID,
  roomName,
}: {
  roomUUID: string;
  roomName?: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteRoom, isPending } = useDeleteRoom();
  const { uuid } = useUserStore(state => state.profile);
  return (
    <>
      <DangerButton size="small" onClick={() => setConfirmOpen(true)}>
        Delete room
      </DangerButton>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !isPending && setConfirmOpen(false)}
        onConfirm={() => deleteRoom(uuid, roomUUID)}
        title={`Delete ${roomName ?? 'this room'}?`}
        message="This permanently deletes the room and all of its messages for every member. This cannot be undone."
        confirmLabel="Delete room"
        loading={isPending}
      />
    </>
  );
}
