import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import WeatherIcon from '../../components/WeatherIcon';
import Sparkline from '../../components/Sparkline';
import { formatHour, formatTemp } from '../../utils/formatters';
import { selectUnits } from './weatherSlice';

const HOURS_SHOWN = 24;

export default function HourlyForecast({ data }) {
  const units = useSelector(selectUnits);

  const hours = useMemo(() => {
    const { hourly, current } = data;
    if (!hourly?.time?.length) return [];
    let start = hourly.time.findIndex((t) => t >= current.time);
    if (start < 0) start = 0;
    return hourly.time.slice(start, start + HOURS_SHOWN).map((time, i) => ({
      time,
      temp: hourly.temperature_2m[start + i],
      code: hourly.weather_code[start + i],
      isDay: hourly.is_day[start + i],
      precipProb: hourly.precipitation_probability?.[start + i],
    }));
  }, [data]);

  if (!hours.length) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Next 24 hours
      </Typography>
      <Sparkline values={hours.map((h) => h.temp)} />
      <Box className="scroll-x" sx={{ mt: 2 }}>
        {hours.map((hour) => (
          <Box
            key={hour.time}
            sx={{ textAlign: 'center', minWidth: 64, flexShrink: 0 }}
          >
            <Typography variant="caption" color="text.secondary">
              {formatHour(hour.time)}
            </Typography>
            <Box sx={{ my: 0.5 }}>
              <WeatherIcon code={hour.code} isDay={hour.isDay} size={26} />
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {formatTemp(hour.temp, units)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              <i className="lni lni-drop" style={{ fontSize: 10 }} />{' '}
              {hour.precipProb ?? 0}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
