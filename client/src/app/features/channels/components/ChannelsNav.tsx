import { primaryBg } from '@/app/shared/lib/constants';
import { Box, Stack, Typography } from '@mui/material';
import Channel from './Channel';
import AddIcon from '@mui/icons-material/Add';
import { Dispatch, SetStateAction } from 'react';
import { TChannel } from '@/app/shared/types/api.types';


interface props {
  openChannelForm: () => void;
  setChannel: Dispatch<SetStateAction<number | undefined>>;
  channels: TChannel[];
}
export default function ChannelsNav({
  openChannelForm,
  setChannel,
  channels,
}: props) {
  return (
    <Stack
      alignSelf={'flex-start'}
      height={'100%'}
      color={'#ffffff'}
      width={'18%'}
      px={2}
      py={3}
      sx={{
        background: primaryBg,
      }}
      gap={2}
    >
      <Box
        sx={{
          ':hover': {
            cursor: 'pointer',
          },
        }}
        display={'flex'}
        justifyContent={'space-between'}
        component={'div'}
        onClick={() => openChannelForm()}
      >
        <Typography fontWeight={'bold'}>channels</Typography>
        <AddIcon />
      </Box>
      {channels?.map((channel, index) => (
        <Box
          component={'div'}
          onClick={() => {
            setChannel(channel.channelId);
          }}
          key={index}
        >
          <Channel
            channelId={channel.channelId}
            type={channel.type}
            name={channel.channelName}
          />
        </Box>
      ))}
    </Stack>
  );
}
