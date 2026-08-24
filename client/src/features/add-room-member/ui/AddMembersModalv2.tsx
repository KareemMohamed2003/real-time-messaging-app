import React from 'react';
import { surfaceDialog, BORDER, ACCENT, ACCENT_HOVER } from '@/themes(legacy)';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  Button,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TagIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import RoomMember from '@/entities/rooms/ui/legacy/RoomMember(legacy)';
import useAddRoomMemberMember from '../model/useAddRoomMembers';

export interface AddMembersModalProps {
  roomUUID: string;
  open: boolean;
  onClose: () => void;
  /** Contextual breadcrumb, e.g. "room1*/
  roomLabel?: string;
  /** Called when the user invites someone by tag/handle */
  onInviteByTag?: (tag: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AddMembersModal({
  open,
  onClose,
  roomLabel,
  onInviteByTag,
  roomUUID,
}: AddMembersModalProps) {

  const {
    handleInvite,
    handleDone,
    toggleMember,
    filteredMembers,
    isSuccess,
    isPending,
    isError,
    query,
    setQuery,
    selectedIds,
    tagValue,
    setTagValue,
  } = useAddRoomMemberMember({ roomUUID, onClose, onInviteByTag });

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
        component={'div'}
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
            <Typography fontWeight={550} sx={{ color: 'white' }}>
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

          {filteredMembers.map((member, index) => {
            const isSelected = selectedIds.has(member.uuid);
            return (
              <RoomMember
                key={index}
                toggleMember={toggleMember}
                member={member}
                isSelected={isSelected}
              />
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
        {isError && (
          <Typography variant="body2" sx={{ color: 'red' }}>
            failed to add member(s)
          </Typography>
        )}
        {isSuccess && (
          <Typography variant="body2" sx={{ color: 'red' }}>
            added members
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: ACCENT, fontWeight: 600 }}>
          {selectedIds.size} selected
        </Typography>
        {isPending ? (
          <CircularProgress size="25px" aria-label="Loading…" />
        ) : (
          <Button
            variant="contained"
            disableElevation
            disabled={selectedIds.size==0}
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
        )}
      </DialogActions>
    </Dialog>
  );
}
