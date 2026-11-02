'use client';

import { List, TextField, InputAdornment, Typography, Box, Divider, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TagIcon from '@mui/icons-material/AlternateEmail';
import SendIcon from '@mui/icons-material/Send';
import ModalShell from '@/shared/components/UI/ModalShell';
import Button from '@/shared/components/UI/Button';
import useAddRoomMemberMember from '../model/useAddRoomMembers';
import AddableRoomMember from '@/entities/rooms/ui/AddableRoomMember';
import Input from '@/shared/components/UI/Input';

export interface AddMembersModalProps {
  roomUUID: string;
  open: boolean;
  onClose: () => void;
  /** Contextual breadcrumb, e.g. "room1" */
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
  const disableClick = selectedIds.size === 0 || isPending;
  return (
    <ModalShell
      isPending={isPending}
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={
        <Box >
          Add members
        </Box>
      }
      subtitle={roomLabel}
      actions={
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {isError && (
              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
                Failed to add member(s)
              </Typography>
            )}
            {isSuccess && (
              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                Members added
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {selectedIds.size} selected
            </Typography>
          </Box>

          <Button
            variant={disableClick ? 'ghost' : 'solid'}
            onClick={handleDone}
            disabled={disableClick}
          >
            {isPending ? 'Adding…' : 'Done'}
          </Button>
        </>
      }
    >
  
      <Input
        fullWidth
        size="small"
        placeholder="Search by name or tag"
        value={query}
        onChange={e => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'sx={{mr:0}} >
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 1,mb:1 }}
      />

      {/* Member list --------------------------------------------------- */}
      <List
        disablePadding
        sx={theme => ({
          maxHeight: 320,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.surface.high,
            borderRadius: 3,
          },
        })}
      >
        {filteredMembers.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No matches found
          </Typography>
        )}

        {filteredMembers.map((member, index) => {
          const isSelected = selectedIds.has(member.uuid);
          return (
            <AddableRoomMember
              key={index}
              toggleMember={toggleMember}
              member={member}
              isSelected={isSelected}
            />
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Invite by tag --------------------------------------------------- */}
      <Typography
        variant="overline"
        sx={{ letterSpacing: 1, display: 'block', mb: 1, color: 'primary.main', fontWeight: 700 }}
      >
        Or invite by tag
      </Typography>
      <Stack direction="row" spacing={1}>
        <Input
          fullWidth
          size="small"
          placeholder="user tag name"
          value={tagValue}
          onChange={e => setTagValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleInvite()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{mr:0}}>
                <TagIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant={!tagValue.trim() ? 'ghost' : 'solid'}
          onClick={handleInvite}
          disabled={!tagValue.trim()}
          endIcon={<SendIcon fontSize="small" />}
          sx={{ flexShrink: 0, px: 2.5 }}
        >
          Invite
        </Button>
      </Stack>
    </ModalShell>
  );
}
