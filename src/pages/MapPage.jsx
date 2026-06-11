import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Loading from '../components/Loading';
import WeatherMap from '../features/map/WeatherMap';
import { selectLocation } from '../features/weather/weatherSlice';

export default function MapPage() {
  const location = useSelector(selectLocation);

  if (!location) {
    return <Loading label="Finding your location…" />;
  }

  return (
    <Paper
      sx={{
        height: { xs: 'calc(100vh - 260px)', md: 'calc(100vh - 220px)' },
        minHeight: 420,
        overflow: 'hidden',
      }}
    >
      <WeatherMap />
    </Paper>
  );
}
