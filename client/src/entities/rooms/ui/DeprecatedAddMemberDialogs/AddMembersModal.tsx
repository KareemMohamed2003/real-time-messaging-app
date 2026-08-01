import React, { useMemo, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import TagIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MemberStatus = 'online' | 'offline' | 'pending';

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  avatarUrl?: string;
}

export interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  /** Contextual breadcrumb, e.g. "room1 · channel1" */
  roomLabel?: string;
  /** Full candidate list; filtering by search happens internally */
  members: Member[];
  /** Called once with the final set of member ids when the user confirms */
  onConfirm: (memberIds: string[]) => void;
  /** Called when the user invites someone by tag/handle */
  onInviteByTag?: (tag: string) => void;
  /** Ids already added before the modal opened (e.g. existing channel members) */
  initialSelectedIds?: string[];
}

// ---------------------------------------------------------------------------
// Presentational helpers
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<MemberStatus, string> = {
  online: '#3fd68c',
  offline: '#6b7280',
  pending: '#f2b544',
};

const STATUS_LABEL: Record<MemberStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  pending: 'Pending',
};

function StatusDot({ status }: { status: MemberStatus }) {
  return (
    <Box
      component="span"
      sx={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        bgcolor: STATUS_COLOR[status],
        display: 'inline-block',
        boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AddMembersModal({
  open,
  onClose,
  roomLabel,
  members,
  onConfirm,
  onInviteByTag,
  initialSelectedIds = [],
}: AddMembersModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialSelectedIds),
  );
  const [tagValue, setTagValue] = useState('');

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, query]);

  const toggleMember = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDone = useCallback(() => {
    onConfirm(Array.from(selectedIds));
    onClose();
  }, [onConfirm, onClose, selectedIds]);

  const handleInvite = useCallback(() => {
    const tag = tagValue.trim();
    if (!tag) return;
    onInviteByTag?.(tag);
    setTagValue('');
  }, [tagValue, onInviteByTag]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="add-members-title"
      PaperProps={{
        sx: {
          bgcolor: '#1c1c1f',
          backgroundImage: 'none',
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.08)',
        },
      }}
    >
      {/* Header ------------------------------------------------------- */}
      <DialogTitle
        id="add-members-title"
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pb: roomLabel ? 0.5 : 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Add members
          </Typography>
          {roomLabel && (
            <Typography variant="caption" color="text.secondary">
              {roomLabel}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          sx={{ color: 'text.secondary', mt: -0.5, mr: -0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Search --------------------------------------------------- */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or tag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1.5,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.04)',
              borderRadius: 1.5,
            },
          }}
        />

        {/* Member list ----------------------------------------------- */}
        <List
          disablePadding
          sx={{
            maxHeight: 320,
            overflowY: 'auto',
            // subtle scrollbar to match a dark chat UI
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 3,
            },
          }}
        >
          {filteredMembers.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 3, textAlign: 'center' }}
            >
              No matches found
            </Typography>
          )}

          {filteredMembers?.map((member) => {
            const isSelected = selectedIds.has(member.id);
            return (
              <ListItem
                key={member.id}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                }}
                secondaryAction={
                  <Button
                    size="small"
                    variant={isSelected ? 'outlined' : 'contained'}
                    onClick={() => toggleMember(member.id)}
                    startIcon={
                      isSelected ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <PersonAddAlt1Icon fontSize="small" />
                      )
                    }
                    sx={{
                      textTransform: 'none',
                      borderRadius: 1.5,
                      minWidth: 88,
                      ...(isSelected && {
                        color: 'text.secondary',
                        borderColor: 'rgba(255,255,255,0.2)',
                      }),
                    }}
                  >
                    {isSelected ? 'Added' : 'Add'}
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={<StatusDot status={member.status} />}
                  >
                    <Avatar src={member.avatarUrl} alt={member.name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={STATUS_LABEL[member.status]}
                  secondaryTypographyProps={{
                    sx: { color: STATUS_COLOR[member.status] },
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        {/* Invite by tag ---------------------------------------------- */}
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 1, display: 'block', mb: 1 }}
        >
          Or invite by tag
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="user tag name"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.04)',
                borderRadius: 1.5,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleInvite}
            disabled={!tagValue.trim()}
            endIcon={<SendIcon fontSize="small" />}
            sx={{ textTransform: 'none', borderRadius: 1.5, px: 2.5 }}
          >
            Invite
          </Button>
        </Stack>
      </DialogContent>

      {/* Footer ----------------------------------------------------- */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {selectedIds.size} added
        </Typography>
        <Button
          variant="contained"
          onClick={handleDone}
          sx={{ textTransform: 'none', borderRadius: 1.5, px: 3 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
