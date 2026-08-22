import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import Input from '@/shared/components/UI/Input';
import { Box, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface props {
  roomName: string;
  setAddMembersDisplay: Dispatch<SetStateAction<boolean>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  displayAddMembers: boolean;
  isOpen: boolean;
}
const iconsStyle = { color: '#545454', fontSize: '2.5rem' };

export default function RoomHeader({
  roomName,
  setAddMembersDisplay,
  isOpen,
  displayAddMembers,
  setOpen,
}: props) {
  return (
    <Box
      px={2}
      py={1}
      display={'flex'}
      gap={3}
      width={'100%'}
      alignItems="center"
      justifyContent={'space-between'}
      sx={{ background: 'rgba(255,255,255,0.07)' }}
    >
      {/*<RoomsIcon height={60} width={60}/>*/}
      <Box>
        <Typography variant={'h6'} fontWeight={500}>
          {roomName}
        </Typography>
      </Box>
      <Box display={'flex'} gap={3} mr={2}>
        {/* <Input  type="text" placeholder="search"/> */}
        <Box position={'relative'}>
          <Input type="text" placeholder="search" />
          {/* <SearchResult/> */}
        </Box>
        <GroupAddIcon
          onClick={() => setAddMembersDisplay(!displayAddMembers)}
          sx={iconsStyle}
        />
        <GroupIcon onClick={() => setOpen(!isOpen)} sx={iconsStyle} />
      </Box>
    </Box>
  );
}
