'use client';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface MessageMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  /** only ever true for your own message */
  canEdit: boolean;
  /** true for your own message, or for a room owner moderating someone else's */
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MessageMenu({
  anchorEl,
  onClose,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: MessageMenuProps) {
  if (!canEdit && !canDelete) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            minWidth: 186,
            borderRadius: `${theme.radius.lg}px`,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.surface.elevated,
            p: 0.5,
          }),
        },
      }}
    >
      {canEdit && (
        <MenuItem
          onClick={onEdit}
          sx={{
            borderRadius: `${8}px`,
            fontWeight: 700,
            fontSize: 13.5,
            gap: 1.25,
          }}
        >
          <ListItemText>Edit message</ListItemText>
          <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </MenuItem>
      )}
      {canDelete && (
        <MenuItem
          onClick={onDelete}
          sx={{
            borderRadius: `${8}px`,
            fontWeight: 700,
            fontSize: 13.5,
            gap: 1.25,
            color: 'error.main',
          }}
        >
          <ListItemText>Delete message</ListItemText>
          <DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />
        </MenuItem>
      )}
    </Menu>
  );
}
