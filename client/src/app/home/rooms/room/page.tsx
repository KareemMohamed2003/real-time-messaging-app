'use client';
import { Box, Stack, Typography } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import person1 from '@/app/people pics/ian-dooley-d1UPkiFd04A-unsplash.jpg';
import React, { useState } from 'react';
import Message from '@/components/Message';
import RoomMembers from '@/components/RoomMembers';
import AddMembers from '@/components/AddMembers';
import Input from '@/components/Input';
import RoomsIcon from '@/components/icons/RoomsIcon';
import Portal from '@/components/Portal';
import SearchResult from '@/components/SearchResults';

// props   roomName, room Image , room members array (a list of users assgined to the room ) , members number
interface IRoom {
  name: string;
  members: any;
  roomIcon: any;
}

export default function Room() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [displayAddMembers, setAddMembersDisplay] = useState<boolean>(true);

  return (
    <Stack
      height={'100%'}
      width={'100%'}
      flexDirection={'column'}
      display={'flex'}
      justifyContent={'space-between'}
    >
      <Box
        padding={1}
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
            room Name
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
            sx={{ color: '#545454', fontSize: '2.5rem' }}
          />
          <GroupIcon
            onClick={() => setOpen(!isOpen)}
            sx={{ color: '#545454', fontSize: '2.5rem' }}
          />
        </Box>
      </Box>

      <Stack px={3} pt={2.5} justifyContent={'space-between'} height={'100%'}>
        {isOpen && <RoomMembers setOpen={setOpen} />}
        {displayAddMembers && (
          <AddMembers setAddMembersDisplay={setAddMembersDisplay} />
        )}
        <Box display={'flex'} flexDirection={'column'}>
          <Message message={"Hi I'm a message"} userImg={person1.src} />
          {/*messages */}
        </Box>

        <Box mx={4} mb={2} display={'flex'} alignItems={'center'} gap={3}>
          <Input
            type="text"
            style={{ width: '100%' }}
            placeholder={'message'}
          />
          <AttachmentIcon width={25} height={25} />
          <Box
            sx={{ background: '#277DCF' }}
            display={'flex'}
            alignItems={'center'}
            p={3}
            justifyContent={'center'}
            height={45}
            width={45}
            borderRadius={'50%'}
          >
            <SendIcon width={25} height={25} />
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
