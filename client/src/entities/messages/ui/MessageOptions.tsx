import AddReactionIcon from '@mui/icons-material/AddReaction';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import { useMessageContext } from './PrivateChatContext';
import { Dispatch, SetStateAction } from 'react';
import { mainStyles } from '@/themes';
export interface MessageOptionsProps {
  messageIndex: number;
  messageId?: number;
  uuid?: string;
  senderUUID?: string;
  disableMessageOptions?: () => void;
  setHovered?: Dispatch<SetStateAction<boolean>>;
  showOptionsMenu?: boolean;
}
export default function MessageOptions({
  messageIndex,
  disableMessageOptions,
}: MessageOptionsProps) {
  const { darkGrey } = mainStyles;
  const { setActiveMenuOptions, toggleMessageEditing } = useMessageContext();
  return (
    <Box
      component={'div'}
      onClick={(e) => e.stopPropagation()}
      py={0.5}
      px={0.5}
      display={'flex'}
      justifySelf={'flex-end'}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={'8px'}
      position="absolute"
      bottom={40}
      left={0}
      right={10}
      mb={2}
      gap={0.5}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        background: darkGrey,
      }}
    >
      <AddReactionIcon />
      <div
        onClick={() => {
          toggleMessageEditing(true);
          setActiveMenuOptions({ index: messageIndex, isMenuActive: false });
          if (disableMessageOptions) {
            disableMessageOptions();
          }
        }}
      >
        <EditIcon />
      </div>
      <Box
        component={'div'}
        onClick={() => {
          setActiveMenuOptions({
            index: messageIndex,
            isMenuActive: true,
          });
        }}
      >
        <MoreHorizIcon />
      </Box>
    </Box>
  );
}
