import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { mainStyles } from '@/themes';
import { forwardRef } from 'react';
import useAddChannels from '../../api/useAddChannels';

interface CreateChannelFormProps {
  closeChannelForm: () => void;
  roomUUID: string;
  // ref:REF
}

const channelFormsModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  p: 4,
};

const CreateChannelForm = forwardRef<HTMLFormElement, CreateChannelFormProps>(
  function CreateChannelForm(
    { closeChannelForm, roomUUID }: CreateChannelFormProps,
    ref
  ) {
    const { handleSubmit, reset, register, onSubmit, errors } = useAddChannels({
      roomUUID,
      closeChannelForm,
    });
    console.log(errors);
    return (
      <Stack
        sx={channelFormsModalStyle}
        gap={2}
        height={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box
          borderRadius={'15px'}
          p={2}
          sx={{ background: mainStyles.primaryBg }}
          component={'form'}
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          display={'flex'}
          gap={2}
          flexDirection={'column'}
        >
          <Typography mb={1} fontWeight={'bold'}>
            create channel
          </Typography>
          {errors.name?.message && (
            <Typography textAlign={'center'} color={'red'}>
              {errors.name.message.replace('String', 'name')}
            </Typography>
          )}
          {/* <Input
            type="text"
            color="white"
            placeholder={'name'}
            {...register('name')}
          /> */}
          {/* <Input
            type="text"
            placeholder={'description'}
            {...register('description')}
          /> */}
          {errors?.type?.message && (
            <Typography textAlign={'center'} color={'red'}>
              {'channel type required'}
            </Typography>
          )}
          <RadioGroup {...register('type')}>
            <FormControlLabel
              {...register('type')}
              value="text"
              control={
                <Radio
                  sx={{
                    '&.Mui-checked': {
                      color: 'green',
                    },
                  }}
                />
              }
              label="text"
            />
            <FormControlLabel
              value="voice"
              control={
                <Radio
                  {...register('type')}
                  sx={{
                    '&.Mui-checked': {
                      color: 'green',
                    },
                  }}
                />
              }
              label="voice"
            />
          </RadioGroup>
          <Box display={'flex'} gap={2}>
            <Button
              type="submit"
              sx={{
                background: mainStyles.mainBlue,
                borderRadius: '15px',
                fontWeight: 'bold',
              }}
            >
              create channel
            </Button>
            <Button
              onClick={() => {
                closeChannelForm();
                reset();
              }}
              sx={{
                background: mainStyles.primaryRed,
                borderRadius: '15px',
                fontWeight: 'bold',
              }}
            >
              cancel
            </Button>
          </Box>
        </Box>
      </Stack>
    );
  }
);

export default CreateChannelForm;
