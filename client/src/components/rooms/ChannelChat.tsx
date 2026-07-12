import { Box } from '@mui/material';
import person1 from '@/app/people pics/ian-dooley-d1UPkiFd04A-unsplash.jpg';
import Message from '@/components/messages/Message';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelMessage } from '@/app/lib/api/queries';
import { channelKeys } from '@/app/lib/api/QueryKeys';
interface props {
  channelId: number;
}

export default function ChannelChat({ channelId }: props) {
  const { data, isLoading } = useQuery({
    queryFn: async () => await getChannelMessage(channelId),
    queryKey: channelKeys.messages(channelId),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
  console.log(data);
  return (
    <Box flex={1} display="flex" flexDirection="column" p={2} gap={2}>
      {/* {data.map((message)=>)} */}

      {/*messages */}
      {/* <Message message={"Hi I'm a message"} userImg={person1.src} /> */}
    </Box>
  );
}
