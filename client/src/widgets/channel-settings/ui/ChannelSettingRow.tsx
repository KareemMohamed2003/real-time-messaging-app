'use client';
import { useState } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@/shared/components/UI/Input';
import ConfirmDialog from '@/shared/components/UI/ConfirmDialog';
import ChannelTypeIcon from '@/entities/channels/ui/ChannelTypeIcon';
import useUpdateChannel from '@/features/update-room-channel';
import useDeleteChannels from '@/features/delete-room-channel';

const renameSchema = z.object({
  name: z.string().trim().min(1, "Channel name can't be empty"),
});
type RenameValues = z.infer<typeof renameSchema>;

export interface ChannelRowProps {
  channelId: number;
  roomUUID: string;
  name: string;
  type: 'TEXT' | 'VOICE';
  /**
   * false when this is the last remaining TEXT channel in the room — a
   * room needs at least one  text channel. Computed by the parent list
   */
  canDelete: boolean;
}

export default function ChannelRow({
  channelId,
  roomUUID,
  name,
  type,
  canDelete,
}: ChannelRowProps) {
  const { renameChannel, isPending } = useUpdateChannel({ roomUUID });
  const { onDelete } = useDeleteChannels({ roomUUID });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const channelParam = z.object({
    channelId: z.number(),
  });
  const parasedChannelId = channelParam.safeParse(channelId);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, errors },
    
  } = useForm<RenameValues>({
    resolver: zodResolver(renameSchema),
    defaultValues: { name },
    mode:'onSubmit'
  });

  const cancelEdit = () => {
    reset({ name });
    setIsEditing(false);
  };

  const submitRename = handleSubmit(data => {
    if (data.name === name) {
      setIsEditing(false);
      return;
    }
    if (parasedChannelId.error) {
      console.log(parasedChannelId)
      setError('form', {
        type: 'required',
        message: "couldn't update channel",
      });
     return ;
    }
    renameChannel(data.name, roomUUID, channelId);
    setIsEditing(false);
  });
console.log(errors)
  return (
    <Stack>
      <Box
        component="form"
        onSubmit={submitRename}
        sx={theme => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.125,
          '&:not(:first-of-type)': { borderTop: `1px solid ${theme.palette.divider}` },
        })}
      >
        <Box
          sx={theme => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            borderRadius: `${theme.radius.sm ?? 6}px`,
            background: theme.palette.surface.elevated,
            color: 'text.secondary',
            flexShrink: 0,
          })}
        >
          <ChannelTypeIcon type={type} />
        </Box>

        {isEditing ? (
          <Input
            autoFocus
            size="small"
            {...register('name')}
            onKeyDown={e => {
              if (e.key === 'Escape') cancelEdit();
            }}
            sx={{ flex: 1 }}
          />
        ) : (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontSize={13.5} fontWeight={600} noWrap>
              {name}
            </Typography>
            <Typography fontSize={11.5} color="text.secondary">
              {type === 'VOICE' ? 'Voice channel' : 'Text channel'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {isEditing ? (
            <>
              <Tooltip title="Save">
                <span>
                  <IconButton size="small" type="submit" disabled={!isDirty}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Cancel">
                <IconButton size="small" type="button" onClick={cancelEdit} disabled={isPending}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Rename">
                <IconButton size="small" type="button" onClick={() => setIsEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={canDelete ? 'Delete channel' : 'A room needs at least one text channel'}
              >
                <span>
                  <IconButton
                    size="small"
                    type="button"
                    disabled={!canDelete}
                    onClick={() => setConfirmingDelete(true)}
                    sx={{ '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
        </Box>

        <ConfirmDialog
          open={confirmingDelete}
          onClose={() => setConfirmingDelete(false)}
          onConfirm={() => onDelete({ channelId })}
          title={`Delete ${type === 'VOICE' ? name : '#' + name}?`}
          message="This permanently deletes the channel and its message history for everyone in this room. This cannot be undone."
          confirmLabel="Delete channel"
        />
      </Box>
      {errors.name?.message && <Typography color="error.main">{errors.name?.message}</Typography>}
      {errors.form && <Typography color="error.main">{errors.form.message}</Typography>}
    </Stack>
  );
}
