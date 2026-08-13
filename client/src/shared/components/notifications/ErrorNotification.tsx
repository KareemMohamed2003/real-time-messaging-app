import { Alert, AlertTitle } from '@mui/material';
interface props {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}
export default function ErrorNotification({ message, severity }: props) {
  return (
    <Alert
      variant="filled"
      severity={severity}
      sx={{ height: 'fit-content', position: 'absolute', m: 'auto' }}
    >
      {message}
    </Alert>
  );
}
