'use client';
import UploadIcon from '@/shared/components/icons/UploadIcon';
import CloseIcon from '@mui/icons-material/Close';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { primaryBg } from '@/shared/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserStore } from '@/app/store/user-store';
import theme, { mainStyles } from '@/themes';
import { ThemeProvider } from '@mui/material/styles';
import UseAddRoom from '../api/useAddRoom';
import Button from '@/shared/components/UI/Button';
import Input from '@/shared/components/UI/Input';

interface props {
  closeRoomForm: () => void;
}
export default function CreateRoomForm({ closeRoomForm }: props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { primaryGreen } = mainStyles;
  const { profile } = useUserStore((state) => state);
  const successCallback = async (result: any) => {
    reset();
    await queryClient.invalidateQueries({ queryKey: ['rooms'] });
    closeRoomForm();
    router.replace('/home/rooms');
    clearErrors();
  };
  const errorCb = (error: any) => {
    setError('name', {
      type: 'server',
      message: error.message,
    });
  };
  const { mutate, isPending } = UseAddRoom(successCallback, errorCb);
  const createRoomSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'room name must be at least 2 characters' })
      .max(30, { message: 'room name must not excceed 30 characters' }),
  });
  type CreateRoomForm = z.infer<typeof createRoomSchema> & {
    uuid: string; // user's uuid
  };
  const {
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
    reset,
    handleSubmit,
    register,
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });
  console.log(errors);
  const onSubmit = (data: CreateRoomForm) => {
    mutate({
      name: data.name, // name from the form
      uuid: profile.uuid!,
    });
  };
  return (
    <ThemeProvider theme={theme}>
      <Stack
        zIndex={10}
        width={'17%'}
        borderRadius={'17px'}
        position={'absolute'}
        alignItems={'center'}
        px={1}
        py={2}
        gap={1}
        sx={{
          background: primaryBg,
        }}
      >
        <CloseIcon
          onClick={() => {
            closeRoomForm();
          }}
          sx={{ color: 'white', alignSelf: 'end' }}
        />
        <Box
          flex={1}
          display={'flex'}
          component={'div'}
          width={'80%'}
          flexDirection={'column'}
          gap={2}
        >
          <Box
            display={'flex'}
            component="div"
            flexDirection={'column'}
            alignSelf={'center'}
            alignItems={'center'}
            width={'100%'}
            py={1}
            borderRadius={'14px'}
            sx={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <UploadIcon width={25} height={25} />
            <Typography fontWeight={'bold'}>upload image</Typography>
          </Box>
          <Box
            component={'form'}
            display={'flex'}
            flex={1}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={2}
            onSubmit={handleSubmit(onSubmit)}
          >
            {errors.name?.message && (
              <Typography textAlign={'center'} color={'red'}>
                {errors.name.message}
              </Typography>
            )}
            <Input type="text" placeholder="room name" {...register('name')} />
            {isPending ? (
              <CircularProgress sx={{ color: primaryGreen, margin: 'auto' }} />
            ) : (
              <Button
                disabled={isPending}
                type="submit"
                variant="contained"
                fullWidth={true}
                sx={{
                  bgColor: '#13CB7E',
                  borderRadius: '18px',
                }}
              >
                create
              </Button>
            )}
          </Box>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
