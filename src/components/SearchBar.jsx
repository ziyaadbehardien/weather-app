import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useSearchLocationsQuery } from '../features/weather/weatherApiSlice';
import { setLocation } from '../features/weather/weatherSlice';

const optionLabel = (option) =>
  [option.name, option.admin1, option.country].filter(Boolean).join(', ');

export default function SearchBar() {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setTerm(input.trim()), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data: options = [], isFetching } = useSearchLocationsQuery(term, {
    skip: term.length < 2,
  });

  const handleSelect = (event, option) => {
    if (!option) return;
    dispatch(
      setLocation({
        latitude: option.latitude,
        longitude: option.longitude,
        name: option.name,
        admin1: option.admin1 ?? '',
        country: option.country ?? '',
      }),
    );
    setInput('');
  };

  return (
    <Autocomplete
      size="small"
      sx={{
        width: { xs: '100%', sm: 320 },
        '& .MuiOutlinedInput-root': {
          bgcolor: 'rgba(255,255,255,0.12)',
          color: '#fff',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
          '&:hover fieldset': { borderColor: 'secondary.main' },
        },
        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={optionLabel}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      loading={isFetching}
      value={null}
      inputValue={input}
      onInputChange={(event, value) => setInput(value)}
      onChange={handleSelect}
      blurOnSelect
      noOptionsText={term.length < 2 ? 'Type to search cities…' : 'No matches'}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search location…"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <i
                  className={`lni ${isFetching ? 'lni-spinner-1 lni-is-spinning' : 'lni-search-alt'}`}
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
