import { useDispatch, useSelector } from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { selectUnits, setUnits } from '../features/weather/weatherSlice';

export default function UnitsToggle() {
  const dispatch = useDispatch();
  const units = useSelector(selectUnits);

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={units}
      onChange={(event, value) => value && dispatch(setUnits(value))}
      sx={{
        '& .MuiToggleButton-root': {
          color: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.3)',
          px: 1.5,
          '&.Mui-selected': {
            color: '#000',
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.main' },
          },
        },
      }}
    >
      <ToggleButton value="metric">°C</ToggleButton>
      <ToggleButton value="imperial">°F</ToggleButton>
    </ToggleButtonGroup>
  );
}
