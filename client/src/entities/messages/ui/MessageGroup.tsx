import { Avatar, Box, Stack, Typography } from '@mui/material';
import MessageRow from './MessageRow';
import { useUserStore } from '@/app/store/user-store';
import UseRoom from '@/entities/rooms/api/useRoom';

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
  /** only ever true when self */
  // canEdit: boolean;
  // /** true when self, or when the viewer is roomOwner */
  // canDelete: boolean;
  onReply?: (messageId: number) => void;
  channelId: number;
  roomUUID?: string;
}

export default function MessageGroup({
  senderName,
  senderAvatar,
  self,
  messages,
  onReply,
  channelId,
  roomUUID,
}: MessageGroupProps) {
  if (messages.length === 0) return null;
  const room = UseRoom(roomUUID!);
  const isRoomOwner = room?.role === 'OWNER';
  const canDeleteMessage = self || isRoomOwner;
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
            channelId={channelId}
            roomUUID={roomUUID}
            text={m.text}
            self={self}
            canEdit={self}
            canDelete={canDeleteMessage}
            onReply={onReply}
          />
        ))}
      </Box>
    </Stack>
  );
}
