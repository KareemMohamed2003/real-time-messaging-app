import { Box } from "@mui/material";
import { MemberStatus, STATUS_COLOR } from "./AddMembersModalv2";

export default function StatusDot({ status }: { status: MemberStatus }) {
  return (
    <Box
      component="span"
      sx={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        bgcolor: STATUS_COLOR[status],
        display: 'inline-block',
        // boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
      }}
    />
  );
}