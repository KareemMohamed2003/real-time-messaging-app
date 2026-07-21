import AttachmentIcon from '@mui/icons-material/Attachment';
import { useState } from 'react';

export default function AttachButton() {
  const [displayMenu, toggleMenu] = useState(false);
  return (
    <>
      <AttachmentIcon
        width={25}
        height={25}
        component={'svg'}
        onClick={() => {}}
      />
    </>
  );
}
