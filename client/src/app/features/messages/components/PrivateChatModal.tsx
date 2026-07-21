import { mainStyles } from '@/themes';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { IMessageMenuOptionModalButton } from './MessageMenuOptionModalButton';
import { useMessageContext } from './PrivateChatContext';
import { togglePortalEffect } from '@/app/shared/lib/utils';
const { grey } = mainStyles;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '24em',
  boxShadow: 24,
  p: 2,
  background: grey,
  borderRadius: '10px',
};
interface props extends IMessageMenuOptionModalButton {}
export default function PrivateChatModal({
  title,
  Component,
  optionComponentProps,
  actionName,
}: props) {
  const { setMessageOptionPortal } = useMessageContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMessageOptionPortal(false);
    togglePortalEffect();
  };
  const componentProps = { ...optionComponentProps, handleClose, title };
  console.log(actionName);
  useEffect(() => {
    handleOpen();
  }, []);
  return (
    <Modal
      sx={{ width: '100%' }}
      open={open}
      onClose={handleClose}
      disableAutoFocus={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} display={'flex'} flexDirection={'column'} gap={2}>
        {Component && <Component {...componentProps} />}
      </Box>
    </Modal>
  );
}
