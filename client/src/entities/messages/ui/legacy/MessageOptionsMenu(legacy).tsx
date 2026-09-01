import { Stack, Box } from '@mui/material';

import MessageMenuOptionModalButton from './MessageMenuOptionModalButton(legacy)';
import DeleteMessagePanel from './DeleteMessagePanel(legacy)';
import EditMessageButton from '../messageOptionsButtons(legacy)/EditMessageButton(legacy)';
import DeleteMessageButton from '../messageOptionsButtons(legacy)/DeleteMessageButton(legacy)';
import { MessageOptionsProps } from './MessageOptions';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ReplyIcon from '@mui/icons-material/Reply';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
interface props extends MessageOptionsProps {
  messageId: number;
}
export default function MessageOptionsMenu({
  messageId,
  senderUUID,
  uuid,
}: props) {
  const menuOptions = [
    // {
    //   option: 'Add reaction',
    //   icon: <AddReactionIcon />,
    //   optionComponentProps: {},
    //   optionComponent:<Box></Box>,
    // },
    // {
    //   option: 'reply',
    //   icon: <ReplyIcon />,
    //   optionComponentProps: { name: 'dsa' },
    //   optionComponent: <Box></Box>,
    // },

    // {
    //   option: 'forward',
    //   icon: <ShortcutIcon />,
    //   optionComponentProps: { name: 'dsa' },
    //   optionComponent: <Box></Box>,
    // },
    // {
    //   option: 'copy text',
    //   icon: <ContentCopyIcon />,
    //   optionComponentProps: { name: 'dsa' },
    //   optionComponent: <Box></Box>,
    // },
    // {
    //   option: 'mark unread',
    //   icon: <MarkChatUnreadIcon />,
    //   optionComponentProps: { name: 'dsa' },
    //   optionComponent: <Box></Box>,
    // },
    {
      option: 'edit message',
      actionButton: EditMessageButton,
      optionComponentProps: { name: '' },
    },
    {
      option: 'delete',
      actionButton: DeleteMessageButton,
      optionComponentProps: { messageId },
      optionComponent: DeleteMessagePanel,
    },
  ];

  if (uuid !== senderUUID) {
    const forbiddenOptions = ['delete', 'edit message'];
    menuOptions.forEach((item, index) => {
      if (forbiddenOptions.includes(item.option)) {
        delete menuOptions[index];
      }
    });
  }

  return (
    <Stack
      component={'div'}
      onClick={ 
        (e) => e.stopPropagation() //stops propagtion to prevent the MessageOptionsMenu from being disabled
      }
      position={'absolute'}
      top={0}
      right={25}
      zIndex={100}
      p={1}
      borderRadius={'25px'}
      sx={{
        background: 'linear-gradient(-360deg, #151A1F80 0%, #23272E80 100%)',
        boxShadow: '0px 12px  20px  0px  rgba(0,0,0,0.25)',
        backdropFilter: 'blur(50px)',
      }}
    >
      {/*       
       sx={(theme) => ({
          width: 400,
          maxWidth: '92vw',
          borderRadius: `${theme.radius.lg}px`,
          p: { xs: 3, sm: 4.25 },
        })} */}
      {menuOptions.map((el, index) => (
        <Box
          key={index}
          width={'15em'}
          display={'flex'}
          justifyContent={'space-between'}
          sx={(theme) => ({
            ':hover':{
              background:theme.palette.surface.high
            }
            // ':hover': {
            //   background: theme.palette.grey,
            //   borderRadius: '25px',
            // },
          })}
          component={'div'}
        >
          <MessageMenuOptionModalButton
            messageId={messageId}
            actionName={el.option}
            Component={el.optionComponent}
            optionComponentProps={el.optionComponentProps}
            title="are you sure you want to delete this message"
            ActionButton={el.actionButton}
          />
        </Box>
      ))}
    </Stack>
  );
}
