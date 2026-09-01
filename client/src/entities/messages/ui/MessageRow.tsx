'use client';
import { Box, IconButton, Tooltip } from '@mui/material';
import MessageBubble from './MessageBubble';
import MessageEditForm from './MessageEditForm';
import MessageMenu from './MessageMenu';
import ConfirmDialog from './ConfirmDialog';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMessageQuery, deleteMessageQuery } from '@/shared/api/queries';
import { IMessage } from '@/shared/types/api.types';
import { channelKeys } from '@/shared/api/QueryKeys';
import { updateMessageInCache } from '@/shared/lib/queryMessagesCacheUtils';
//
export interface MessageRowProps {
  messageId: number;
  text: string;
  /** true when the current user sent this message */
  self: boolean;
  /** true only for your own message — editing someone else's isn't offered anywhere */
  canEdit: boolean;
  /** true for your own message, or for a room owner */
  canDelete: boolean;
  /** wired up once real reply threading exists; no-op today, same as the prototype's mocked toast */
  onReply?: (messageId: number) => void;
  /** the channel this message belongs to — same value for a DM channel or a room's TEXT channel */
  channelId: number;
  /** present for room messages, absent for DMs — see note on cache updates below */
  roomUUID?: string;
}

// use zustand store to select roomUUUID instead of having to pass it down
export default function MessageRow({
  messageId,
  text,
  self,
  canEdit,
  canDelete,
  onReply,
  channelId,
  roomUUID,
}: MessageRowProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { mutate: saveEdit, isPending: isSaving } = useMutation<IMessage, Error, string>({
    mutationFn: (message: string) => updateMessageQuery(messageId, message),
    onSuccess: editedMessage => {
      // if data is not defined this will silently fail , we need to make sure this is always data.
      console.log(editedMessage);
      updateMessageInCache(queryClient, channelId, editedMessage, roomUUID!);
      setIsEditing(false);
    },
  });

  const { mutate: runDelete, isPending: isDeleting } = useMutation({
    mutationFn: (idToDelete: number) => deleteMessageQuery(idToDelete),
    onSuccess: deletedMessageId => {
      queryClient.setQueryData(
        channelKeys.messages(channelId, roomUUID!),
        (messages: IMessage[]) => {
          if (!Array.isArray(messages)) return messages;
          const filteredMessages = messages.filter(message => message.id !== deletedMessageId);
          console.log(filteredMessages);
          return [...filteredMessages];
        }
      );
      setConfirmingDelete(false);
    },
  });

  const showMenuTrigger = canEdit || canDelete;

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .message-row-actions': { opacity: 1, pointerEvents: 'auto' },
      }}
    >
      {isEditing ? (
        <MessageEditForm
          initialValue={text}
          isSaving={isSaving}
          onCancel={() => setIsEditing(false)}
          onSave={value => saveEdit(value)}
        />
      ) : (
        <>
          <MessageBubble text={text} self={self} />

          <Box
            className="message-row-actions"
            sx={theme => ({
              position: 'absolute',
              top: -34,
              ...(self ? { left: 4 } : { right: -16 }),
              display: 'flex',
              gap: 0.25,
              p: 0.125,
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 120ms ease',
              background: theme.palette.surface.elevated,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${theme.radius.md}px`,
              boxShadow: theme.shadows[4],
              zIndex: 2,
            })}
          >
            <Tooltip title="React">
              <IconButton size="small">
                <AddReactionOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {!self && (
              <>
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={() => onReply?.(messageId)}>
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy">
                  <IconButton size="small" onClick={() => navigator.clipboard?.writeText(text)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {showMenuTrigger && (
              <Tooltip title="More">
                <IconButton size="small" onClick={e => setMenuAnchor(e.currentTarget)}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </>
      )}

      <MessageMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={() => {
          setMenuAnchor(null);
          setIsEditing(true);
        }}
        onDelete={() => {
          setMenuAnchor(null);
          setConfirmingDelete(true);
        }}
      />

      <ConfirmDialog
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        onConfirm={() => runDelete(messageId)}
        isConfirming={isDeleting}
        title="Delete message?"
        description="This cannot be undone."
        confirmLabel="Delete"
      />
    </Box>
  );
}
