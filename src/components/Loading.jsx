import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Loading({ label = 'Loading…' }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, color: 'primary.main' }}>
      <i className="lni lni-spinner-1 lni-is-spinning" style={{ fontSize: 32 }} />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}
