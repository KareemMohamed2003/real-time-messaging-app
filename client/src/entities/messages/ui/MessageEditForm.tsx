'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box } from '@mui/material';
import Input from '@/shared/components/UI/Input';
import Button, { GhostButton } from '@/shared/components/UI/Button';

const editMessageSchema = z.object({
  value: z.string().trim().min(1, "Message can't be empty"),
});
type EditMessageValues = z.infer<typeof editMessageSchema>;

export interface MessageEditFormProps {
  initialValue: string;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (value: string) => void;
}


export default function MessageEditForm({
  initialValue,
  isSaving,
  onCancel,
  onSave,
}: MessageEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditMessageValues>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: { value: initialValue },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => onSave(data.value.trim()))}
      sx={{ width: 230, maxWidth: '100%' }}
    >
      <fieldset
        style={{ border: 'none', padding: 0, margin: 0 }}
        disabled={isSaving}
      >
        <Input
          autoFocus
          size="small"
          error={!!errors.value}
          helperText={errors.value?.message}
          {...register('value')}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 0.75,
            mt: 0.75,
          }}
        >
          <GhostButton
            size="small"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </GhostButton>
          <Button size="small" type="submit" disabled={isSaving || !isDirty}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </Box>
      </fieldset>
    </Box>
  );
}
