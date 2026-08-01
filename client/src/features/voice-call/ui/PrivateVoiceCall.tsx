import { useEffect, useRef, useState } from 'react';
import { mainStyles } from '@/themes';
import { Box } from '@mui/material';
import User from '@/shared/components/User';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import { cancelCall } from '@/shared/lib/webrtc';
import { useUserStore } from '@/app/store/user-store';

export default function PrivateVoiceCall() {
  const { grey } = mainStyles;
  const { audioCall, profile, toggleMic } = useUserStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { friendId, remoteStream, localStream, isMuted } = audioCall!;
  console.log('remoteStream', audioCall.remoteStream);
  const { friend_profile_img } = audioCall;
  const connectedUsers = [
    { profilePic: profile.profile_img, name: profile.username },
    { profilePic: friend_profile_img, name: audioCall.friendName },
  ];

  useEffect(() => {
    console.log('useEFFECT HOOK');
    audioRef!.current!.srcObject = audioCall.remoteStream!;

    return () => {
      const tracks = remoteStream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, [remoteStream]);
  return (
    <Box
      width={'15em'}
      display={'flex'}
      alignItems={'center'}
      mt={2}
      borderRadius={'10px'}
      px={1}
      py={1}
      sx={{ background: grey }}
      alignSelf={'center'}
      justifyContent={'space-around'}
    >
      <Box display={'flex'}>
        {connectedUsers.map((user, index) => (
          <User key={index} profilePic={user.profilePic!} name="" />
        ))}
      </Box>
      <Box display={'flex'} gap={2}>
        <div onClick={() => toggleMic()}>
          {!isMuted ? (
            <MicIcon sx={{ fontSize: '1.70rem', alignSelf: 'center' }} />
          ) : (
            <MicOffIcon sx={{ fontSize: '1.70rem', alignSelf: 'center' }} />
          )}
        </div>

        <Box
          component={'div'}
          onClick={() => cancelCall(friendId, profile.uuid!)}
          sx={{ background: 'red' }}
          borderRadius={'10px'}
          px={1.2}
          display={'flex'}
          alignItems={'center'}
        >
          <CallEndIcon sx={{ fontSize: '1.70rem', alignSelf: 'center' }} />
        </Box>
      </Box>

      <audio ref={audioRef} autoPlay></audio>
    </Box>
  );
}
