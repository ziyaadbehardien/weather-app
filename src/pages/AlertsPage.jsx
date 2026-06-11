import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Loading from '../components/Loading';
import useAlerts from '../features/alerts/useAlerts';
import { formatPlace } from '../utils/formatters';
import { selectLocation } from '../features/weather/weatherSlice';

export default function AlertsPage() {
  const location = useSelector(selectLocation);
  const { alerts, isLoading } = useAlerts();

  if (!location || isLoading) {
    return <Loading label="Checking for severe weather…" />;
  }

  return (
    <Stack spacing={2}>
      <div>
        <Typography variant="h5">Severe weather alerts</Typography>
        <Typography variant="body2" color="text.secondary">
          Derived from the next 48 hours of forecast data for{' '}
          {formatPlace(location)}
        </Typography>
      </div>

      {alerts.length === 0 ? (
        <Alert severity="success">
          <AlertTitle>All clear</AlertTitle>
          No severe weather is expected in the next 48 hours.
        </Alert>
      ) : (
        alerts.map((alert) => (
          <Alert key={alert.id} severity={alert.severity}>
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.description}
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 0.5, opacity: 0.8 }}
            >
              Affects {alert.hoursAffected}{' '}
              {alert.hoursAffected === 1 ? 'hour' : 'hours'} of the 48-hour
              outlook
            </Typography>
          </Alert>
        ))
      )}
    </Stack>
  );
}
