import Box from '@mui/material/Box';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function WeatherIcon({ code, isDay = 1, size = 32, sx }) {
  const { label, emoji } = getWeatherInfo(code, isDay);
  return (
    <Box
      component="span"
      role="img"
      aria-label={label}
      title={label}
      sx={{ fontSize: size, lineHeight: 1, ...sx }}
    >
      {emoji}
    </Box>
  );
}
