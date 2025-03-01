import Box from '@mui/material/Box';

export default function FriendsIcon({ height, width }: any) {
  return (
    <Box sx={{ height: height, width: width }}>
      <svg
        width={'100%'}
        height={'100%'}
        viewBox="0 0 17 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.31296 4.2C9.46074 4.2 10.3912 3.2598 10.3912 2.1C10.3912 0.940202 9.46074 0 8.31296 0C7.16518 0 6.23472 0.940202 6.23472 2.1C6.23472 3.2598 7.16518 4.2 8.31296 4.2Z"
          fill="#696767"
        />
        <path
          d="M12.3551 6.4155C11.9499 6.006 11.2537 5.25 9.90281 5.25C9.6846 5.25 8.42726 5.25 7.26345 5.25C4.40587 5.2395 2.07824 2.8875 2.07824 0H0C0 3.318 2.19254 6.132 5.1956 7.0455V21H7.27384V14.7H9.35208V21H11.4303V8.4525L15.5348 12.6L17 11.1195L12.3551 6.4155Z"
          fill="#696767"
        />
      </svg>
    </Box>
  );
}
