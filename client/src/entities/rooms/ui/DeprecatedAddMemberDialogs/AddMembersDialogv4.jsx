import { useMemo, useState } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SendIcon from '@mui/icons-material/Send';

// Palette pulled from the existing app (unchanged from before).
const colors = {
  surfaceDialog: '#1a1d24',
  surfaceHeader: '#21242c',
  surfaceInput: '#14161b',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#e5e7eb',
  textSecondary: '#8b93a1',
  textMuted: '#6b7280',
  avatarBg: '#3a3f4b',
  online: '#2dd4bf',
  pending: '#d4a017',
  offline: '#6b7280',
  accent: '#3b82f6',
  success: '#10b981',
};

// status: 'online' | 'offline' | 'pending'
function StatusDot({ status }) {
  return (
    <span
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: colors[status],
        border: `2px solid ${colors.surfaceDialog}`,
      }}
    />
  );
}

function MemberRow({ member, state, onToggle }) {
  return (
    <ListItem
      sx={{
        borderRadius: 2,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
      }}
      secondaryAction={
        state === 'added' ? (
          // Confirmed state — kept low-key (outlined) since it's no longer
          // an action to take, just a status. High emphasis is reserved for
          // the single task-completing button ("done") in the footer.
          <Button
            size="small"
            variant="outlined"
            startIcon={<CheckIcon fontSize="small" />}
            sx={{
              color: colors.success,
              borderColor: colors.success,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 999,
              '&:hover': { borderColor: colors.success, bgcolor: 'rgba(16,185,129,0.08)' },
            }}
            onClick={() => onToggle(member.id)}
          >
            added
          </Button>
        ) : state === 'pending' ? (
          <Button
            size="small"
            disabled
            variant="outlined"
            startIcon={<ScheduleIcon fontSize="small" />}
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              color: colors.textMuted,
              borderColor: colors.border,
            }}
          >
            invited
          </Button>
        ) : (
          // Repeated per-row action → lower-emphasis outlined button.
          // This keeps visual weight off actions the user will click many
          // times, reserving solid/filled buttons for the single action
          // that finishes the task.
          <Button
            size="small"
            variant="outlined"
            startIcon={<PersonAddIcon fontSize="small" />}
            sx={{
              color: colors.accent,
              borderColor: colors.accent,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 999,
              '&:hover': { borderColor: colors.accent, bgcolor: 'rgba(59,130,246,0.08)' },
            }}
            onClick={() => onToggle(member.id)}
          >
            add
          </Button>
        )
      }
    >
      <ListItemAvatar sx={{ position: 'relative', width: 44 }}>
        <Avatar sx={{ bgcolor: colors.avatarBg, width: 38, height: 38 }} />
        <StatusDot status={member.status} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            sx={{ color: colors.textPrimary, fontSize: 14, fontWeight: 500 }}
          >
            {member.name}
          </Typography>
        }
        secondary={
          <Typography sx={{ color: colors[member.status], fontSize: 12 }}>
            {member.status}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default function AddMembersDialog({
  open,
  onClose,
  friends = [],
  roomName = 'room1',
  channelName = 'channel1',
}) {
  const [query, setQuery] = useState('');
  const [memberState, setMemberState] = useState({}); // id -> 'added' | 'pending'
  const [tag, setTag] = useState('');

  const dummyFriends = [
    { id: 1, name: 'Alice Johnson', status: 'online' },
    { id: 2, name: 'Bob Smith', status: 'offline' },
    { id: 3, name: 'Charlie Davis', status: 'pending' },
    { id: 4, name: 'Diana Prince', status: 'online' },
    { id: 5, name: 'Ethan Hunt', status: 'offline' },
    { id: 6, name: 'Fiona Gallagher', status: 'pending' },
  ];

  const filtered = useMemo(
    () =>
      dummyFriends.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      ),
    [friends, query]
  );

  const addedCount = Object.values(memberState).filter((s) => s === 'added').length;

  const handleToggle = (id) =>
    setMemberState((prev) => ({
      ...prev,
      [id]: prev[id] === 'added' ? undefined : 'added',
    }));

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        elevation: 0,
        sx: {
          bgcolor: colors.surfaceDialog,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 'none',
          border: `1px solid ${colors.border}`,
        },
      }}
    >
      {/* Header — right modal's layout: title + subtitle left, close icon right */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1}>
            <PersonAddIcon sx={{ color: colors.textPrimary, fontSize: 20 }} />
            <Typography
              sx={{ color: colors.textPrimary, fontSize: 15, fontWeight: 500 }}
            >
              add members
            </Typography>
          </Stack>
          <Typography sx={{ color: colors.textSecondary, fontSize: 12, mt: 0.5 }}>
            {roomName} · {channelName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ color: colors.textSecondary, fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2.5, pt: 0.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="search by name or tag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: colors.surfaceInput,
              borderRadius: 999,
              color: colors.textPrimary,
              '& fieldset': { borderColor: colors.border },
            },
          }}
        />
      </Box>

      <List sx={{ px: 1.5, py: 1, maxHeight: 260, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <Typography
            sx={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', py: 4 }}
          >
            No friends match "{query}"
          </Typography>
        )}
        {filtered.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            state={memberState[member.id]}
            onToggle={handleToggle}
          />
        ))}
      </List>

      {/* Divider + invite-by-tag section — right modal's layout */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1 }}>
        <Divider sx={{ flex: 1, borderColor: colors.border }} />
        <Typography sx={{ color: colors.textMuted, fontSize: 11, letterSpacing: 0.5 }}>
          OR INVITE BY TAG
        </Typography>
        <Divider sx={{ flex: 1, borderColor: colors.border }} />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 1.5, pt: 0.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="user tag name"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonAddIcon sx={{ color: colors.textMuted, fontSize: 18 }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: colors.surfaceInput,
              borderRadius: 999,
              color: colors.textPrimary,
              '& fieldset': { borderColor: colors.border },
            },
          }}
        />
        {/* High-emphasis solid button — a genuine one-off confirming action */}
        <Button
          variant="contained"
          endIcon={<SendIcon fontSize="small" />}
          sx={{
            bgcolor: colors.accent,
            color: '#0b1220',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 999,
            px: 2.5,
            '&:hover': { bgcolor: colors.accent },
          }}
        >
          invite
        </Button>
      </Stack>

      <Divider sx={{ borderColor: colors.border }} />

      {/* Footer — brings back the left modal's status-feedback pattern
          (Nielsen heuristic: visibility of system status) plus the single
          high-emphasis "done" button that closes out the task */}
      <Stack direction="row" alignItems="center" sx={{ px: 2.5, py: 1.5 }}>
        <Typography sx={{ color: colors.textMuted, fontSize: 12, mr: 'auto' }}>
          {addedCount} added
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: colors.accent,
            color: '#0b1220',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 999,
            px: 3,
            '&:hover': { bgcolor: colors.accent },
          }}
        >
          done
        </Button>
      </Stack>
    </Dialog>
  );
}
