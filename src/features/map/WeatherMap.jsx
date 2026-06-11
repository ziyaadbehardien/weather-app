import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useLazyReverseGeocodeQuery } from '../weather/weatherApiSlice';
import {
  selectLocation,
  selectUnits,
  setLocation,
} from '../weather/weatherSlice';
import useForecast from '../weather/useForecast';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatPlace, formatTemp } from '../../utils/formatters';
import RadarLayer from './RadarLayer';

// Vite breaks Leaflet's default icon path resolution — point it at the
// bundled assets explicitly.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ClickToSelect({ onPick }) {
  useMapEvents({
    click: (event) => onPick(event.latlng),
  });
  return null;
}

function Recenter({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 8));
  }, [map, latitude, longitude]);
  return null;
}

export default function WeatherMap() {
  const dispatch = useDispatch();
  const location = useSelector(selectLocation);
  const units = useSelector(selectUnits);
  const { data: forecast } = useForecast();
  const [reverseGeocode] = useLazyReverseGeocodeQuery();
  const [radarOn, setRadarOn] = useState(true);

  if (!location) return null;

  const handlePick = async ({ lat, lng }) => {
    const latitude = +lat.toFixed(4);
    const longitude = +lng.toFixed(4);
    // Set coordinates immediately so the forecast refreshes, then improve
    // the label once reverse geocoding resolves.
    dispatch(
      setLocation({ latitude, longitude, name: 'Dropped pin', admin1: '', country: '' }),
    );
    try {
      const place = await reverseGeocode({ latitude, longitude }).unwrap();
      dispatch(setLocation({ latitude, longitude, ...place }));
    } catch {
      // keep the generic pin label
    }
  };

  const current = forecast?.current;
  const condition = current
    ? getWeatherInfo(current.weather_code, current.is_day)
    : null;

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={8}
        scrollWheelZoom
      >
        <TileLayer
          className="map-tiles-night"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {radarOn && <RadarLayer />}
        <ClickToSelect onPick={handlePick} />
        <Recenter latitude={location.latitude} longitude={location.longitude} />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <strong>{formatPlace(location)}</strong>
            {current && (
              <div>
                {condition.emoji} {formatTemp(current.temperature_2m, units)} —{' '}
                {condition.label}
              </div>
            )}
          </Popup>
        </Marker>
      </MapContainer>

      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1000,
          px: 1.5,
          py: 0.5,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={radarOn}
              onChange={(event) => setRadarOn(event.target.checked)}
            />
          }
          label={<Typography variant="body2">Precipitation radar</Typography>}
        />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 12,
          zIndex: 1000,
          px: 1.5,
          py: 0.75,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          <i className="lni lni-map-marker" /> Click anywhere on the map to get
          the forecast for that spot
        </Typography>
      </Paper>
    </Box>
  );
}
