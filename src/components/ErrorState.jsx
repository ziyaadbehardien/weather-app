import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ErrorState({
  message = 'Something went wrong while fetching data.',
  onRetry,
}) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <i
        className="lni lni-warning"
        style={{ fontSize: 32, color: '#FFD60A' }}
      />
      <Typography sx={{ mt: 2, mb: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}
