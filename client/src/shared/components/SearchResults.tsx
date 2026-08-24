import { Stack } from '@mui/material';

import User from './User';

export default function SearchResult({ results, component }: any) {
  //this component takes  results array , a component that will be used to render the results
  // for each scenario in our app for example if u only want to search friends then we pass the friends component
  // same for the RoomMembers
  return (
    <Stack
      mt={1}
      zIndex={10}
      left={0}
      right={0}
      height={'45vh'}
      overflow={'auto'}
      sx={{ backdropFilter: 'blur(20px)' }}
      spacing={4}
      p={2}
      position={'absolute'}
      bgcolor={'rgb(255,235,235,0.07)'}
      borderRadius={4}
    >
      <User name='' profilePic=''/>
      <User name='' profilePic=''/>
      <User name='' profilePic=''/>

    </Stack>
  );
}
