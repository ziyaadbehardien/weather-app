export const tempUnit = (units) => (units === 'imperial' ? '°F' : '°C');
export const windUnit = (units) => (units === 'imperial' ? 'mph' : 'km/h');
export const precipUnit = (units) => (units === 'imperial' ? 'in' : 'mm');

export const formatTemp = (value, units) =>
  value == null ? '–' : `${Math.round(value)}${tempUnit(units)}`;

export const formatWind = (value, units) =>
  value == null ? '–' : `${Math.round(value)} ${windUnit(units)}`;

export const formatPrecip = (value, units) =>
  value == null ? '–' : `${Math.round(value * 10) / 10} ${precipUnit(units)}`;

// Open-Meteo returns ISO strings already in the location's local time
// (timezone=auto), so we format from the string rather than the Date object.
export const formatHour = (isoLocal) => isoLocal?.slice(11, 16) ?? '–';

export const formatWeekday = (isoDate, options = { weekday: 'short' }) =>
  new Date(`${isoDate}T12:00:00`).toLocaleDateString(undefined, options);

export const formatDayHour = (isoLocal) => {
  if (!isoLocal) return '–';
  return `${formatWeekday(isoLocal.slice(0, 10))} ${formatHour(isoLocal)}`;
};

export const formatPlace = (location) =>
  [location?.name, location?.admin1, location?.country]
    .filter(Boolean)
    .join(', ');
