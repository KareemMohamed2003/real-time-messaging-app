'use client';
import ModalShell from '@/shared/components/UI/ModalShell';
import Button, { GhostButton, DangerButton } from '@/shared/components/UI/Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** red confirm button — defaults on, since this is mainly used for destructive actions */
  danger?: boolean;
  loading?: boolean;
}

/**
 * Generic confirm dialog on top of ModalShell — covers "Kick member?" and
 * "Delete room?" , 'Delete message' 
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  loading,
}: ConfirmDialogProps) {
  const ConfirmButton = danger ? DangerButton : Button;

  return (
    <ModalShell
      open={open}
      onClose={() => !loading && onClose()}
      title={title}
      subtitle={message}
      actions={
        <>
          <GhostButton onClick={onClose} disabled={loading}>
            {cancelLabel}
          </GhostButton>
          <ConfirmButton onClick={onConfirm} disabled={loading}>
            {loading ? `${confirmLabel}…` : confirmLabel}
          </ConfirmButton>
        </>
      }
    >
      {null}
    </ModalShell>
  );
}
