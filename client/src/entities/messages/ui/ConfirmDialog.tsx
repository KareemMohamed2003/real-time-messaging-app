'use client';
import { ReactNode } from 'react';
import Button, { GhostButton, DangerButton } from '@/shared/components/UI/Button';
import ModalShell from '@/shared/components/UI/ModalShell';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  /** red confirm button for destructive actions (default) — set false for neutral confirmations */
  danger?: boolean;
}

/**
 * Replaces DeleteMessagePanel.tsx + PrivateChatModal.tsx.
 *
 * Those two together built a one-off "modal that renders a delete
 * confirmation for a message." The new design's prototype explicitly
 * reuses a single confirm modal for delete-message, leave-room, kick
 * member, etc. — so instead of porting the message-specific version,
 * this is that shared component. Message deletion becomes a consumer
 * of it (see MessageRow), and the same component is what you'd reach
 * for later on room/friend deletions.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isConfirming,
  danger = true,
}: ConfirmDialogProps) {
  const ConfirmButton = danger ? DangerButton : Button;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={title}
      subtitle={description}
      hideCloseButton
      maxWidth="xs"
      actions={
        <>
          <GhostButton onClick={onClose} disabled={isConfirming}>
            {cancelLabel}
          </GhostButton>
          <ConfirmButton onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Please wait…' : confirmLabel}
          </ConfirmButton>
        </>
      }
    />
  );
}
