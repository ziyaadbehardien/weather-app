import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import WeatherIcon from '../../components/WeatherIcon';
import { formatTemp, formatWeekday, formatWind } from '../../utils/formatters';
import { selectUnits } from './weatherSlice';

export default function DailyForecast({ data }) {
  const units = useSelector(selectUnits);
  const { daily } = data;
  if (!daily?.time?.length) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        7-day forecast
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(7, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {daily.time.map((date, i) => (
          <Box
            key={date}
            sx={{
              textAlign: 'center',
              p: 1.5,
              borderRadius: 2,
              bgcolor: i === 0 ? 'rgba(255,214,10,0.10)' : 'background.default',
            }}
          >
            <Typography variant="subtitle2">
              {i === 0 ? 'Today' : formatWeekday(date)}
            </Typography>
            <Box sx={{ my: 1 }}>
              <WeatherIcon code={daily.weather_code[i]} size={30} />
            </Box>
            <Typography variant="body2" fontWeight={700}>
              {formatTemp(daily.temperature_2m_max[i], units)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatTemp(daily.temperature_2m_min[i], units)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'primary.main', display: 'block', mt: 0.5 }}
            >
              <i className="lni lni-drop" style={{ fontSize: 10 }} />{' '}
              {daily.precipitation_probability_max?.[i] ?? 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <i className="lni lni-wind" style={{ fontSize: 10 }} />{' '}
              {formatWind(daily.wind_speed_10m_max?.[i], units)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
