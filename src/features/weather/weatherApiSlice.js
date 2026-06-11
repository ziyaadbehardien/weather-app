import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
].join(',');

const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_gusts_10m',
  'uv_index',
  'visibility',
  'is_day',
].join(',');

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
].join(',');

export const weatherApiSlice = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    getForecast: builder.query({
      query: ({ latitude, longitude, units }) => ({
        url: FORECAST_URL,
        params: {
          latitude,
          longitude,
          current: CURRENT_FIELDS,
          hourly: HOURLY_FIELDS,
          daily: DAILY_FIELDS,
          timezone: 'auto',
          forecast_days: 7,
          ...(units === 'imperial' && {
            temperature_unit: 'fahrenheit',
            wind_speed_unit: 'mph',
            precipitation_unit: 'inch',
          }),
        },
      }),
      keepUnusedDataFor: 300,
    }),
    searchLocations: builder.query({
      query: (name) => ({
        url: GEOCODING_URL,
        params: { name, count: 8, language: 'en', format: 'json' },
      }),
      transformResponse: (response) => response?.results ?? [],
    }),
    reverseGeocode: builder.query({
      query: ({ latitude, longitude }) => ({
        url: REVERSE_GEOCODING_URL,
        params: { latitude, longitude, localityLanguage: 'en' },
      }),
      transformResponse: (response) => ({
        name:
          response?.city || response?.locality || 'Dropped pin',
        admin1: response?.principalSubdivision || '',
        country: response?.countryName || '',
      }),
    }),
  }),
});

export const {
  useGetForecastQuery,
  useSearchLocationsQuery,
  useLazyReverseGeocodeQuery,
} = weatherApiSlice;
