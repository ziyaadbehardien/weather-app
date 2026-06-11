import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

export default function AlertBanner({ alerts }) {
  if (!alerts?.length) return null;

  const worst = alerts[0];
  const extra = alerts.length - 1;

  return (
    <Alert
      severity={worst.severity}
      action={
        <Button color="inherit" size="small" component={RouterLink} to="/alerts">
          View alerts
        </Button>
      }
    >
      {worst.title}
      {extra > 0 && ` — plus ${extra} more active ${extra === 1 ? 'alert' : 'alerts'}`}
    </Alert>
  );
}
