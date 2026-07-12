import { Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/app/store/user-store';
import IncomingCall from './IncomingCall';

export default function IncomingCallModal() {
  const [open, setOpen] = useState(false);
  const { incomingCalls, localPeer } = useUserStore((state) => state);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleOpen();
  }, [incomingCalls]);
  if (incomingCalls.size)
    return (
      <Modal
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
        }}
        open={open}
        onClose={handleClose}
        disableAutoFocus={true}
        disableEscapeKeyDown
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        hideBackdrop={true}
      >
        <Stack
          alignItems="center"
          justifyContent={'center'}
          gap={2}
          height={'100%'}
        >
          {Array.from(incomingCalls.entries()).map(([callerID, call]) => (
            <IncomingCall
              key={callerID}
              callerID={callerID}
              profile_img={call.friend_profile_img!}
              localPeer={localPeer!}
              caller={call.friendName}
            />
          ))}
        </Stack>
      </Modal>
    );
  else return null;
}
