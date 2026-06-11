import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import AlertBanner from '../components/AlertBanner';
import CurrentConditions from '../features/weather/CurrentConditions';
import HourlyForecast from '../features/weather/HourlyForecast';
import DailyForecast from '../features/weather/DailyForecast';
import useForecast from '../features/weather/useForecast';
import useAlerts from '../features/alerts/useAlerts';
import { selectLocation } from '../features/weather/weatherSlice';

export default function ForecastPage() {
  const location = useSelector(selectLocation);
  const { data, isLoading, isFetching, isError, refetch } = useForecast();
  const { alerts } = useAlerts();

  if (!location || isLoading || (isFetching && !data)) {
    return <Loading label="Fetching your forecast…" />;
  }

  if (isError) {
    return (
      <ErrorState
        message="We couldn't load the forecast. Check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <AlertBanner alerts={alerts} />
      <CurrentConditions data={data} />
      <HourlyForecast data={data} />
      <DailyForecast data={data} />
    </Stack>
  );
}
