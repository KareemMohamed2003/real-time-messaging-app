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
