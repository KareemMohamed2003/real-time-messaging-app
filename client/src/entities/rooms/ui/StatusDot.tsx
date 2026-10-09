import { MemberStatus, STATUS_COLOR } from '@/features/add-room-member/model/types';
import { Box } from '@mui/material';

export default function StatusDot({ status }: { status: MemberStatus }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        width: 9,
        height: 9,
        borderRadius: '50%',
        bgcolor: STATUS_COLOR[status],
        display: 'inline-block',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      })}
    />
  );
}
