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
// import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import useAddRoomMember from '../api/useAddRoomMemberMutation';
import { surfaceDialog, BORDER, ACCENT, ACCENT_HOVER } from '@/themes';
import { useUserStore } from '@/app/store/user-store';
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
  roomUUID: string;
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
// Design tokens
// ---------------------------------------------------------------------------
// The host app's MUI theme doesn't expose the blue used across its chips/tags
// (see "channels", "dsd", etc. in the sidebar), so rather than gamble on
// `theme.palette.primary` resolving to the right color, we pin it here.
// Change ACCENT to match your brand color exactly — everything else derives
// from it.

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
        // boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
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
  roomUUID,
}: AddMembersModalProps) {
  // add Room Member logic
  const { friends } = useUserStore((state) => state);
  console.log(friends);
  const { addMember } = useAddRoomMember();

  // rest of  component
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(initialSelectedIds)
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
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="add-members-title"
      PaperProps={{
        sx: {
          bgcolor: surfaceDialog,
          backgroundImage: 'none',
          borderRadius: 2,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
        },
      }}
    >
      {/* Header ------------------------------------------------------- */}
      <DialogTitle
        id="add-members-title"
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddAlt1Icon
              fontSize="medium"
              sx={{ color: ACCENT, display: 'block' }}
            />
            <Typography variant="h6" fontWeight={550} sx={{ color: 'white' }}>
              add members
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {roomLabel && (
          <Typography
            variant="subtitle1"
            sx={{ display: 'block', mt: 0.75, color: 'white' }}
          >
            {roomLabel}
          </Typography>
        )}
      </DialogTitle>

      <Divider sx={{ borderColor: BORDER }} />
      <DialogContent>
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
                <SearchIcon fontSize="small" sx={{ color: ACCENT }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1.5,
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

          {filteredMembers.map((member) => {
            const isSelected = selectedIds.has(member.id);
            return (
              <ListItem
                // onClick={()=>addMember({ roomUUID, role:'MEMBER', userId:'' })}
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
                    disableElevation
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
                      borderRadius: 5,
                      minWidth: 92,
                      fontWeight: 600,
                      ...(isSelected
                        ? {
                            color: ACCENT,
                            borderColor: ACCENT,
                            bgcolor: 'transparent',
                            '&:hover': {
                              borderColor: ACCENT,
                              bgcolor: 'rgba(59,124,246,0.08)',
                            },
                          }
                        : {
                            bgcolor: ACCENT,
                            color: '#fff',
                            '&:hover': { bgcolor: ACCENT_HOVER },
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
                  primaryTypographyProps={{ color: 'white' }}
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

        <Divider sx={{ my: 2, borderColor: BORDER }} />

        {/* Invite by tag ---------------------------------------------- */}
        <Typography
          variant="overline"
          sx={{ letterSpacing: 1, display: 'block', mb: 1, color: ACCENT }}
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
                  <TagIcon fontSize="small" sx={{ color: ACCENT }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={handleInvite}
            disabled={!tagValue.trim()}
            endIcon={<SendIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              px: 2.5,
              fontWeight: 600,
              bgcolor: ACCENT,
              '&:hover': { bgcolor: ACCENT_HOVER },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
              },
            }}
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
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <Typography variant="body2" sx={{ color: ACCENT, fontWeight: 600 }}>
          {selectedIds.size} added
        </Typography>
        <Button
          variant="contained"
          disableElevation
          onClick={handleDone}
          sx={{
            textTransform: 'none',
            borderRadius: 1.5,
            px: 3,
            fontWeight: 600,
            bgcolor: ACCENT,
            '&:hover': { bgcolor: ACCENT_HOVER },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
