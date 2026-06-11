import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocation, setLocation } from './weatherSlice';
import { useLazyReverseGeocodeQuery } from './weatherApiSlice';

const DEFAULT_LOCATION = {
  latitude: -26.2041,
  longitude: 28.0473,
  name: 'Johannesburg',
  admin1: 'Gauteng',
  country: 'South Africa',
};

/**
 * On first visit (no persisted location) ask the browser for the user's
 * position and reverse-geocode it. Falls back to a default city if the
 * user declines or geolocation is unavailable.
 */
export default function useInitialLocation() {
  const dispatch = useDispatch();
  const location = useSelector(selectLocation);
  const [reverseGeocode] = useLazyReverseGeocodeQuery();

  useEffect(() => {
    if (location) return;

    if (!('geolocation' in navigator)) {
      dispatch(setLocation(DEFAULT_LOCATION));
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (cancelled) return;
        const latitude = +coords.latitude.toFixed(4);
        const longitude = +coords.longitude.toFixed(4);
        let place = { name: 'My location', admin1: '', country: '' };
        try {
          place = await reverseGeocode({ latitude, longitude }).unwrap();
        } catch {
          // keep generic label if reverse geocoding fails
        }
        if (!cancelled) {
          dispatch(setLocation({ latitude, longitude, ...place }));
        }
      },
      () => {
        if (!cancelled) dispatch(setLocation(DEFAULT_LOCATION));
      },
      { timeout: 8000, maximumAge: 600000 },
    );

    return () => {
      cancelled = true;
    };
  }, [location, dispatch, reverseGeocode]);
}
