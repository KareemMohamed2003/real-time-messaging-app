import Typography from '@mui/material/Typography';
import ErrorState from '@/shared/components/UI/ErrorState';
import { AppRoutes } from '@/shared/lib/utils';


export default function NotFound() {
  return (
    <ErrorState
      icon={
        <Typography
          fontFamily="'Space Grotesk', sans-serif"
          fontSize={64}
          fontWeight={700}
          color="primary.main"
          lineHeight={1}
        >
          404
        </Typography>
      }
      title="This page doesn't exist"
      description=""
      primaryAction={{ label: 'Back to chats', href: AppRoutes.HOME_ROUTE }}
      secondaryAction={{ label: 'Go to rooms', href: AppRoutes.ROOMS_ROUTE }}
    />
  );
}
