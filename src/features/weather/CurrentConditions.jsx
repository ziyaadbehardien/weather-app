import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import WeatherIcon from '../../components/WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodes';
import {
  formatHour,
  formatPlace,
  formatPrecip,
  formatTemp,
  formatWind,
} from '../../utils/formatters';
import { selectLocation, selectUnits } from './weatherSlice';

function Stat({ icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        component="i"
        className={`lni ${icon}`}
        sx={{ fontSize: 20, color: 'primary.main', width: 24, textAlign: 'center' }}
      />
      <Box>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CurrentConditions({ data }) {
  const location = useSelector(selectLocation);
  const units = useSelector(selectUnits);
  const { current, daily } = data;
  const { label } = getWeatherInfo(current.weather_code, current.is_day);

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          gap: 4,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <WeatherIcon
            code={current.weather_code}
            isDay={current.is_day}
            size={72}
          />
          <Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              <i className="lni lni-map-marker" /> {formatPlace(location)}
            </Typography>
            <Typography variant="h4" component="div" sx={{ my: 0.5 }}>
              {formatTemp(current.temperature_2m, units)}
            </Typography>
            <Typography color="text.secondary">{label}</Typography>
            <Typography variant="caption" color="text.secondary">
              Updated {formatHour(current.time)} local time
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          <Stat
            icon="lni-pulse"
            label="Feels like"
            value={formatTemp(current.apparent_temperature, units)}
          />
          <Stat
            icon="lni-drop"
            label="Humidity"
            value={`${Math.round(current.relative_humidity_2m)}%`}
          />
          <Stat
            icon="lni-wind"
            label="Wind"
            value={formatWind(current.wind_speed_10m, units)}
          />
          <Stat
            icon="lni-arrow-up"
            label="Gusts"
            value={formatWind(current.wind_gusts_10m, units)}
          />
          <Stat
            icon="lni-cloud"
            label="Pressure"
            value={`${Math.round(current.surface_pressure)} hPa`}
          />
          <Stat
            icon="lni-cloudy-sun"
            label="Precipitation"
            value={formatPrecip(current.precipitation, units)}
          />
          <Stat
            icon="lni-sun"
            label="Sunrise"
            value={formatHour(daily?.sunrise?.[0])}
          />
          <Stat
            icon="lni-night"
            label="Sunset"
            value={formatHour(daily?.sunset?.[0])}
          />
        </Box>
      </Box>
    </Paper>
  );
}
