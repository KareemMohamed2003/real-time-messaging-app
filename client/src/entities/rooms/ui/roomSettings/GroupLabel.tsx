import { Typography } from "@mui/material";
import { ReactNode } from "react";

export default function GroupLabel({ children, first }: { children: ReactNode; first?: boolean }) {
  return (
    <Typography
      fontSize={11}
      color="text.disabled"
      sx={{ textTransform: 'uppercase', letterSpacing: '.06em', mt: first ? 0.25 : 2, mb: 0.75 }}
    >
      {children}
    </Typography>
  );
}


