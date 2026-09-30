'use client';
import { Avatar, Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DmListItem from '@/entities/conversation/ui/DmListItem';
import { useState, useMemo, SetStateAction, Dispatch } from 'react';
import { getRecentConversations } from '@/shared/api/queries';
import { userKeys } from '@/shared/api/QueryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { IDirectMessage } from '@/shared/types/api.types';
import useSearch from '@/shared/hooks/useSearch';

export interface DmListProps {
  activeFriendUUID?: string | null;
  onSelectConversation: Dispatch<SetStateAction<string>>;
}

export default function DmList({ activeFriendUUID, onSelectConversation }: DmListProps) {
  // const [search, setSearch] = useState('');
  const { data: conversations } = useSuspenseQuery<IDirectMessage[]>({
    queryKey: userKeys.recentDMs,
    queryFn: getRecentConversations,
  });
  const {
    filteredList: filteredConversations,
    search,
    setSearch,
  } = useSearch(conversations, 'username');
  console.log(conversations);

  const isEmpty = conversations.length === 0;

  return (
    <Box
      sx={theme => ({
        width: 300,
        flex: '0 0 300px',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      })}
    >
      <Box
        sx={theme => ({
          height: 60,
          flex: '0 0 60px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          px: 2.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Typography variant="subtitle1" fontWeight={700} fontSize={16}>
          Chats
        </Typography>
      </Box>

      {/* MuiOutlinedInput's theme override already supplies the surface2
          background, border/focus-ring colors, and autofill fix — no need
          to re-declare any of that here, just the search icon + placeholder. */}
      <Box sx={{ px: 2.25, py: 1.5, flexShrink: 0 }}>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, py: 0.5 }}>
        {isEmpty && (
          <Box display="flex" alignItems="center" gap={1.375} px={2.25} py={1.5}>
            <Avatar
              sx={theme => ({ width: 38, height: 38, background: theme.palette.surface.elevated })}
            />
            <Typography fontSize={13.5} fontWeight={600} color="text.disabled">
              No chats yet
            </Typography>
          </Box>
        )}

        {filteredConversations.map(c => (
          <DmListItem
            key={c.uuid}
            name={c.username}
            avatarUrl={c?.profile_img!}
            colorSeed={c.uuid}
            preview={c.lastMessage}
            active={c.uuid === activeFriendUUID}
            onClick={() => onSelectConversation(c.uuid)}
          />
        ))}
      </Box>
    </Box>
  );
}
