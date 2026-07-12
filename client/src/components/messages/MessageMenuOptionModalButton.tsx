import * as React from 'react';
import Box from '@mui/material/Box';
import { useMessageContext } from './PrivateChatContext';

export interface IMessageMenuOptionModalButton {
  title: string;
  optionComponentProps: any;
  Component: any;
  actionName: string;
  messageId: number;
  ActionButton?: any;
}
export default function MessageMenuOptionModalButton({
  ActionButton,
  messageId,
  Component,
  optionComponentProps,
  actionName,
  title,
}: IMessageMenuOptionModalButton) {
  const {
    setMessageOptionPortal,
    selectMessageOptionComponent,
    clearActiveMessageMenuOptions,
    closeMessageMenuOptions,
  } = useMessageContext();
  const nonModalRequiring = ['edit message'];
  const doesModalRequireBackdrop = !nonModalRequiring.includes(actionName);
  return (
    <Box
      width={'100%'}
      component={'div'}
      onClick={() => {
        if (doesModalRequireBackdrop) {
          selectMessageOptionComponent({
            component: Component,
            props: optionComponentProps,
            messageId: messageId!,
            title: title!,
            actionName: actionName,
          });
          setMessageOptionPortal(true);
          clearActiveMessageMenuOptions();
        }
      }}
    >
      <Box component={'div'} p={1}>
        {<ActionButton id={messageId} />}
      </Box>
    </Box>
  );
}
