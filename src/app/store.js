import { configureStore } from '@reduxjs/toolkit';
import { weatherApiSlice } from '../features/weather/weatherApiSlice';
import weatherReducer from '../features/weather/weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    [weatherApiSlice.reducerPath]: weatherApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApiSlice.middleware),
});

store.subscribe(() => {
  const { location, units } = store.getState().weather;
  try {
    localStorage.setItem('weather-app:prefs', JSON.stringify({ location, units }));
  } catch {
    // storage unavailable (private mode etc.) — preferences just won't persist
  }
});
