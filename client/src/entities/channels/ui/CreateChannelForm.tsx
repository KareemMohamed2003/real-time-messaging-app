'use client';

import { forwardRef } from 'react';
import { Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ModalShell from '@/shared/components/UI/ModalShell';
import Input from '@/shared/components/UI/Input';
import Button, { GhostButton } from '@/shared/components/UI/Button';
import SegmentedControl from '@/shared/components/UI/SegmentedControl';
import useAddChannels from '../api/useAddChannels';

interface CreateChannelFormProps {
  closeChannelForm: () => void;
  roomUUID: string;
}

const CHANNEL_TYPE_OPTIONS = [
  { value: 'text', label: '# Text' },
  { value: 'voice', label: '🔊 Voice' },
];

const CreateChannelForm = forwardRef<HTMLFormElement, CreateChannelFormProps>(
  function CreateChannelForm({ closeChannelForm, roomUUID }, ref) {

    const { handleSubmit, reset, register, onSubmit, errors, control } =
      useAddChannels({
        roomUUID,
        closeChannelForm,
      });

    return (
      <ModalShell
        open
        onClose={closeChannelForm}
        title="Create a channel"
        onSubmit={handleSubmit(onSubmit)}
        formRef={ref}
        actions={
          <>
            <GhostButton
              onClick={() => {
                closeChannelForm();
                reset();
              }}
            >
              Cancel
            </GhostButton>
            <Button type="submit">Create channel</Button>
          </>
        }
      >
        <Input
          label="Channel name"
          placeholder="e.g. announcements"
          error={!!errors.name}
          helperText={errors.name?.message?.replace('String', 'name')}
          {...register('name')}
        />

        <Box mt={2}>
          <Typography
            fontSize={12.5}
            fontWeight={600}
            color="text.secondary"
            mb={0.75}
          >
            Channel type
          </Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <SegmentedControl
                value={field.value}
                onChange={field.onChange}
                options={CHANNEL_TYPE_OPTIONS}
              />
            )}
          />
          {errors.type && (
            <Typography fontSize={12} color="error.main" mt={0.75}>
              Channel type required
            </Typography>
          )}
        </Box>
      </ModalShell>
    );
  }
);

export default CreateChannelForm;
