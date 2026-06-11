import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetForecastQuery } from './weatherApiSlice';
import { selectLocation, selectUnits } from './weatherSlice';

/**
 * Forecast for the currently selected location in the selected units.
 * Safe to call from multiple components — RTK Query dedupes the request.
 */
export default function useForecast() {
  const location = useSelector(selectLocation);
  const units = useSelector(selectUnits);

  return useGetForecastQuery(
    location
      ? { latitude: location.latitude, longitude: location.longitude, units }
      : skipToken,
  );
}
