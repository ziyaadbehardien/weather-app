import { createSlice } from '@reduxjs/toolkit';

const loadPrefs = () => {
  try {
    return JSON.parse(localStorage.getItem('weather-app:prefs')) ?? {};
  } catch {
    return {};
  }
};

const prefs = loadPrefs();

const initialState = {
  // { latitude, longitude, name, admin1, country }
  location: prefs.location ?? null,
  // 'metric' | 'imperial'
  units: prefs.units === 'imperial' ? 'imperial' : 'metric',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setUnits: (state, action) => {
      state.units = action.payload === 'imperial' ? 'imperial' : 'metric';
    },
  },
});

export const { setLocation, setUnits } = weatherSlice.actions;

export const selectLocation = (state) => state.weather.location;
export const selectUnits = (state) => state.weather.units;

export default weatherSlice.reducer;
