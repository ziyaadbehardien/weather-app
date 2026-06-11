import { formatDayHour } from '../../utils/formatters';

const LOOKAHEAD_HOURS = 48;

// Thresholds keyed by the unit system the API responded in.
const GUST_SEVERE = { metric: 90, imperial: 56 };
const GUST_ADVISORY = { metric: 60, imperial: 37 };
const HEAT = { metric: 38, imperial: 100 };
const COLD = { metric: -15, imperial: 5 };
const RAIN_RATE = { metric: 10, imperial: 0.4 }; // per hour
const FOG_VISIBILITY_M = 500; // visibility is always metres

const THUNDER_CODES = new Set([95, 96, 99]);
const FREEZING_CODES = new Set([56, 57, 66, 67]);
const HEAVY_RAIN_CODES = new Set([65, 82]);
const HEAVY_SNOW_CODES = new Set([75, 86]);

const buildRules = (units) => [
  {
    id: 'thunderstorm',
    severity: 'error',
    title: 'Thunderstorm warning',
    match: (h) => THUNDER_CODES.has(h.code),
    describe: (peak, start) =>
      `Thunderstorms (possibly with hail) are forecast, starting around ${start}. Stay indoors and away from open ground.`,
  },
  {
    id: 'freezing-precip',
    severity: 'error',
    title: 'Freezing rain / icy conditions',
    match: (h) => FREEZING_CODES.has(h.code),
    describe: (peak, start) =>
      `Freezing drizzle or rain is expected from ${start}. Roads and walkways may become dangerously icy.`,
  },
  {
    id: 'damaging-wind',
    severity: 'error',
    title: 'Damaging winds',
    match: (h) => h.gust >= GUST_SEVERE[units],
    peak: (h) => h.gust,
    describe: (peak, start) =>
      `Destructive wind gusts up to ${Math.round(peak)} ${units === 'imperial' ? 'mph' : 'km/h'} expected, starting around ${start}. Secure loose objects.`,
  },
  {
    id: 'wind-advisory',
    severity: 'warning',
    title: 'Strong wind advisory',
    match: (h) => h.gust >= GUST_ADVISORY[units] && h.gust < GUST_SEVERE[units],
    peak: (h) => h.gust,
    describe: (peak, start) =>
      `Wind gusts up to ${Math.round(peak)} ${units === 'imperial' ? 'mph' : 'km/h'} expected, starting around ${start}.`,
  },
  {
    id: 'heavy-rain',
    severity: 'warning',
    title: 'Heavy rain — localised flooding possible',
    match: (h) => HEAVY_RAIN_CODES.has(h.code) || h.precip >= RAIN_RATE[units],
    peak: (h) => h.precip,
    describe: (peak, start) =>
      `Intense rainfall is forecast from around ${start}. Watch for water pooling on roads and low-lying areas.`,
  },
  {
    id: 'heavy-snow',
    severity: 'warning',
    title: 'Heavy snowfall',
    match: (h) => HEAVY_SNOW_CODES.has(h.code),
    describe: (peak, start) =>
      `Heavy snow showers are expected from around ${start}. Travel may be disrupted.`,
  },
  {
    id: 'extreme-heat',
    severity: 'warning',
    title: 'Extreme heat',
    match: (h) => h.temp >= HEAT[units],
    peak: (h) => h.temp,
    describe: (peak, start) =>
      `Temperatures reaching ${Math.round(peak)}${units === 'imperial' ? '°F' : '°C'} expected from ${start}. Stay hydrated and avoid prolonged sun exposure.`,
  },
  {
    id: 'extreme-cold',
    severity: 'warning',
    title: 'Extreme cold',
    match: (h) => h.temp <= COLD[units],
    peak: (h) => h.temp,
    describe: (peak, start) =>
      `Temperatures dropping to ${Math.round(peak)}${units === 'imperial' ? '°F' : '°C'} expected from ${start}. Limit time outdoors.`,
  },
  {
    id: 'dense-fog',
    severity: 'warning',
    title: 'Dense fog',
    match: (h) => h.visibility != null && h.visibility <= FOG_VISIBILITY_M,
    describe: (peak, start) =>
      `Visibility may drop below 500 m from around ${start}. Allow extra travel time.`,
  },
  {
    id: 'high-uv',
    severity: 'info',
    title: 'Very high UV index',
    match: (h) => h.uv >= 8,
    peak: (h) => h.uv,
    describe: (peak, start) =>
      `UV index reaching ${Math.round(peak)} around ${start}. Sun protection is recommended.`,
  },
];

const SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };

/**
 * Derive severe-weather alerts from the next 48 hours of an Open-Meteo
 * forecast response. Returns [{ id, severity, title, description, startsAt }]
 * sorted most-severe first.
 */
export function deriveAlerts(forecast, units) {
  const hourly = forecast?.hourly;
  if (!hourly?.time?.length) return [];

  const currentTime = forecast.current?.time ?? hourly.time[0];
  let startIndex = hourly.time.findIndex((t) => t >= currentTime);
  if (startIndex < 0) startIndex = 0;
  const endIndex = Math.min(startIndex + LOOKAHEAD_HOURS, hourly.time.length);

  const hours = [];
  for (let i = startIndex; i < endIndex; i += 1) {
    hours.push({
      time: hourly.time[i],
      code: hourly.weather_code?.[i],
      temp: hourly.temperature_2m?.[i],
      precip: hourly.precipitation?.[i] ?? 0,
      gust: hourly.wind_gusts_10m?.[i] ?? 0,
      uv: hourly.uv_index?.[i] ?? 0,
      visibility: hourly.visibility?.[i],
    });
  }

  const alerts = [];
  for (const rule of buildRules(units)) {
    const matches = hours.filter(rule.match);
    if (!matches.length) continue;

    const peak = rule.peak
      ? Math.max(...matches.map(rule.peak))
      : null;
    const startsAt = matches[0].time;
    const start = formatDayHour(startsAt);

    alerts.push({
      id: rule.id,
      severity: rule.severity,
      title: rule.title,
      description: rule.describe(peak, start),
      startsAt,
      hoursAffected: matches.length,
    });
  }

  return alerts.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.startsAt.localeCompare(b.startsAt),
  );
}
