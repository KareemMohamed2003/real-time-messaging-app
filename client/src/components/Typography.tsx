import { Typography, TypographyProps } from '@mui/material';

type TTypographyProps = TypographyProps & { label: string };
export default function CustomTypography({ label }: TTypographyProps) {
  return (
    <Typography
      variant={'h2'}
      sx={{
        backgroundImage:
          'linear-gradient(90deg, rgba(129,130,130,1) 0%, rgba(45,45,45,1) 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      fontWeight="bold"
    >
      {label}
    </Typography>
  );
}
