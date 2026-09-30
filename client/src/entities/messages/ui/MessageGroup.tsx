import { Avatar, Box, Stack, Typography } from '@mui/material';
import MessageRow from './MessageRow';
import { useUserStore } from '@/app/store/use-user-store';import UseRoom from '@/entities/rooms/api/useRoom';
import { QueryKey } from '@tanstack/react-query';

export interface GroupedMessage {
  id: number;
  text: string;
  /** pre-formatted for display, e.g. "9:41 AM" */
  timestamp: string;
}

export interface MessageGroupProps {
  senderName: string;
  senderAvatar?: string;
  /** true when the current user sent every message in this group */
  self: boolean;
  messages: GroupedMessage[];
  queryKey: QueryKey;
  onReply?: (messageId: number) => void;
  roomUUID?: string;
}

export default function MessageGroup({
  senderName,
  senderAvatar,
  self,
  messages,
  onReply,
  roomUUID,
  queryKey
}: MessageGroupProps) {
  if (messages.length === 0) return null;
  const room = UseRoom(roomUUID!);
  const isRoomOwner = room?.role === 'OWNER';
  const canDeleteMessage = self || isRoomOwner;
  console.log(self);
  return (
    <Stack
      direction={self ? 'row-reverse' : 'row'}
      sx={{
        gap: 1,
        maxWidth: '64%',
        alignSelf: self ? 'flex-end' : 'flex-start',
      }}
    >
      <Avatar src={senderAvatar} sx={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>
        {!senderAvatar && senderName.slice(0, 2).toUpperCase()}
      </Avatar>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: self ? 'flex-end' : 'flex-start',
          minWidth: 0,
        }}
      >
        <Typography fontSize={11.5} color="text.disabled">
          {self ? messages[0].timestamp : `${senderName} · ${messages[0].timestamp}`}
        </Typography>

        {messages.map(m => (
          <MessageRow
            key={m.id}
            messageId={m.id}
            text={m.text}
            self={self}
            canEdit={self}
            canDelete={canDeleteMessage}
            onReply={onReply}
            queryKey={queryKey}
          />
        ))}
      </Box>
    </Stack>
  );
}
