import Message from './Message';
import MessageOptions from './MessageOptions';
import MessageEditor from './MessageEditor';
import MessageOptionsMenu from './MessageOptionsMenu';
import { useMessageContext } from './PrivateChatContext';
import { Box } from '@mui/material';
import { useUserStore } from '@/app/store/user-store';
import { useState } from 'react';
interface IPrivateMessageItem {
  message: any;
  friendProfileImg: string;
  uuid: string;
  messageIndex: number;
}
export default function PrivateMessageItem({
  message,
  friendProfileImg,
  uuid,
  messageIndex,
}: IPrivateMessageItem) {
  const { profile } = useUserStore((state) => state);
  const { activeMenuOption, setActiveMenuOptions, isEditing } =
    useMessageContext();
  const [displayMessageOptions, setMessageOptionsVisibility] =
    useState<boolean>(false);
  const [isHovered, setHovered] = useState<boolean>(false);
  const isMessageMenuSelected = messageIndex === activeMenuOption.index;
  const isMessageOptionsActive = displayMessageOptions && isHovered;
  const disableMessageOptions = () => setMessageOptionsVisibility(false);
  const enableMessageOptions = () => setMessageOptionsVisibility(true);
  return (
    <Box
      display={'flex'}
      width={'100%'}
      justifyContent={'space-between'}
      borderRadius={'15px'}
      component={'div'}
      position={'relative'}
      mt={1.6}
      p={2}
      onMouseEnter={() => {
        enableMessageOptions();
        setHovered(true);
      }}
      onMouseLeave={() => {
        if (activeMenuOption.index !== messageIndex || displayMessageOptions) {
          disableMessageOptions();
          setHovered(false);
          return;
        }
        setHovered(false);
      }}
      sx={{
        ':hover': {
          boxShadow: '0px 12px  20px  0px  rgba(0,0,0,0.25)',
        },
      }}
    >
      {isEditing && isMessageMenuSelected ? (
        <MessageEditor
          message={message.message}
          messageId={message.id}
          setHovered={setHovered}
          setActiveMenuOptions={setActiveMenuOptions}
        />
      ) : (
        <Message
          message={message?.message}
          senderUUID={message?.senderUUID}
          userImg={
            message?.senderUUID === uuid
              ? profile.profile_img
              : friendProfileImg
          }
          uuid={uuid}
        />
      )}
      {isMessageOptionsActive && !isEditing && (
        <MessageOptions
          messageIndex={messageIndex}
          disableMessageOptions={disableMessageOptions}
        />
      )}
      {activeMenuOption.isMenuActive && isMessageMenuSelected && (
        <MessageOptionsMenu
          messageIndex={messageIndex}
          messageId={message.id}
          senderUUID={message.senderUUID}
          uuid={uuid}
        />
      )}
    </Box>
  );
}
