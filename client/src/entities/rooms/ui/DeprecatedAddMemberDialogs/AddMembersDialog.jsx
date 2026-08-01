import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Button,
  Typography,
  Divider,
  Stack,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleIcon from '@mui/icons-material/Schedule';

// Palette pulled from the existing app (see chat + colors below).
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
          <Button
            size="small"
            startIcon={<CheckIcon fontSize="small" />}
            sx={{
              color: '#06281f',
              bgcolor: colors.success,
              borderColor: colors.success,
              '&:hover': { bgcolor: colors.success },
              textTransform: 'none',
              fontWeight: 500,
            }}
            variant="contained"
            onClick={() => onToggle(member.id)}
          >
            added
          </Button>
        ) : state === 'pending' ? (
          <Button
            size="small"
            disabled
            startIcon={<ScheduleIcon fontSize="small" />}
            sx={{ textTransform: 'none', color: colors.textMuted }}
          >
            invited
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            startIcon={<PersonAddIcon fontSize="small" />}
            sx={{
              color: colors.accent,
              borderColor: colors.accent,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: colors.accent,
                bgcolor: 'rgba(59,130,246,0.08)',
              },
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

export default function AddMembersDialog({ open, onClose, friends = [] }) {
  const [query, setQuery] = useState('');
  const [memberState, setMemberState] = useState({}); // id -> 'added' | 'pending'
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

  const addedCount = Object.values(memberState).filter(
    (s) => s === 'added'
  ).length;

  const handleToggle = (id) =>
    setMemberState((prev) => ({
      ...prev,
      [id]: prev[id] === 'added' ? undefined : 'added',
    }));

  return (
    <Box>
      <Dialog
        open={true}
        onClose={onClose}
        sx={{left:100}}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { bgcolor: colors.surfaceDialog, borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: colors.surfaceHeader,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <PersonAddIcon sx={{ color: colors.textPrimary, fontSize: 20 }} />
            <Typography
              sx={{ color: colors.textPrimary, fontSize: 15, fontWeight: 500 }}
            >
              add members
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ color: colors.textSecondary, fontSize: 18 }} />
          </IconButton>
         </DialogTitle> 

        <DialogContent sx={{ p: 2 }}>
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
                borderRadius: 2,
                color: colors.textPrimary,
                '& fieldset': { borderColor: colors.border },
              },
            }}
            sx={{ mb: 1 }}
          />

          <List sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                state={
                  memberState[member.id] ?? member.status === 'pending-invite'
                    ? 'pending'
                    : memberState[member.id]
                }
                onToggle={handleToggle}
              />
            ))}
          </List>
        </DialogContent>

        <Divider sx={{ borderColor: colors.border }} />

        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Typography
            sx={{ color: colors.textMuted, fontSize: 12, mr: 'auto' }}
          >
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
              '&:hover': { bgcolor: colors.accent },
            }}
          >
            done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
