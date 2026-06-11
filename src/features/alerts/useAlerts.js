import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useForecast from '../weather/useForecast';
import { selectUnits } from '../weather/weatherSlice';
import { deriveAlerts } from './alertRules';

export default function useAlerts() {
  const { data, isLoading } = useForecast();
  const units = useSelector(selectUnits);

  const alerts = useMemo(
    () => (data ? deriveAlerts(data, units) : []),
    [data, units],
  );

  return { alerts, isLoading };
}
