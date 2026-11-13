import { useEffect, useRef, useState } from 'react';

import { usePersistentState } from '../../hooks/usePersistentState';
import { STORAGE_PREFIX } from '../../lib/storage';
import { LIMITS, isPlainObject, isString } from '../../lib/validation';

import './weather.css';

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const STORAGE_KEY = `${STORAGE_PREFIX}weather`;
const REQUEST_TIMEOUT_MS = 10000;
const CITY_RE = /^[\p{L}\p{M}\s.'’,-]+$/u;
const ICON_RE = /^\d{2}[dn]$/;
const DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

/** Shape we keep in storage: only the fields we show, all type-checked. */
const isWeather = (w) =>
  isPlainObject(w) &&
  isString(w.city) &&
  isString(w.country) &&
  ['temp', 'feelsLike', 'pressure', 'humidity', 'windSpeed', 'windDeg', 'sunrise', 'sunset', 'timezone'].every((k) =>
    isNum(w[k]),
  ) &&
  isString(w.icon) &&
  isString(w.description);

/** Picks and validates the fields we need from the API response. */
function toWeather(data) {
  const weather = {
    city: data?.name,
    country: data?.sys?.country ?? '',
    temp: data?.main?.temp,
    feelsLike: data?.main?.feels_like,
    pressure: data?.main?.pressure,
    humidity: data?.main?.humidity,
    windSpeed: data?.wind?.speed ?? 0,
    windDeg: data?.wind?.deg ?? 0,
    sunrise: data?.sys?.sunrise,
    sunset: data?.sys?.sunset,
    timezone: data?.timezone ?? 0,
    icon: ICON_RE.test(data?.weather?.[0]?.icon ?? '') ? data.weather[0].icon : '',
    description: data?.weather?.[0]?.description ?? '',
  };
  return isWeather(weather) ? weather : null;
}

function errorMessage(status) {
  if (status === 404) return 'City not found. Check the spelling or try another city.';
  if (status === 401) return 'Weather service rejected the API key.';
  if (status === 429) return 'Too many requests. Try again in a minute.';
  return 'Weather service is unavailable. Try again later.';
}

// Sunrise/sunset in the city's own time zone, not the visitor's.
function cityTime(unixSeconds, timezoneSeconds) {
  return new Date((unixSeconds + timezoneSeconds) * 1000).toLocaleTimeString('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function dayDuration(sunrise, sunset) {
  const seconds = Math.max(0, sunset - sunrise);
  return `${Math.floor(seconds / 3600)} h ${Math.floor((seconds % 3600) / 60)} m`;
}

const windDirection = (deg) => DIRECTIONS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
const hPaToMmHg = (hPa) => Math.round(hPa * 0.750063755419211);

export default function Weather() {
  const [weather, setWeather] = usePersistentState(STORAGE_KEY, null, isWeather);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  // Cancel a pending request if the component unmounts.
  useEffect(() => () => controllerRef.current?.abort(), []);

  const search = async (event) => {
    event.preventDefault();
    const query = city.trim().replace(/\s+/g, ' ');

    if (!query) return setError('Enter a city name.');
    if (query.length > LIMITS.cityMax || !CITY_RE.test(query)) {
      return setError('Use letters, spaces, hyphens and commas only (e.g. "Lviv" or "Paris, FR").');
    }
    if (!API_KEY) return setError('Weather API key is not configured (VITE_WEATHER_API_KEY).');

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ q: query, units: 'metric', appid: API_KEY });
      const response = await fetch(`${API_URL}?${params}`, { signal: controller.signal });
      if (!response.ok) {
        setError(errorMessage(response.status));
        return undefined;
      }
      const result = toWeather(await response.json());
      if (!result) {
        setError('Got an unexpected response from the weather service.');
        return undefined;
      }
      setWeather(result);
      setCity('');
    } catch (err) {
      if (controllerRef.current === controller) {
        setError(err.name === 'AbortError' ? 'The request took too long. Try again.' : 'No connection to the weather service.');
      }
    } finally {
      clearTimeout(timeout);
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
    return undefined;
  };

  const clear = () => {
    setWeather(null);
    setError('');
  };

  return (
    <div className="weather">
      <h2 className="weather__title">Weather</h2>
      <form className="weather__input input" onSubmit={search} noValidate role="search">
        <label htmlFor="city" className="visually-hidden">
          City
        </label>
        <input
          className="input__city"
          id="city"
          type="text"
          value={city}
          maxLength={LIMITS.cityMax}
          autoComplete="address-level2"
          onChange={(e) => {
            setCity(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter City"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'city-error' : undefined}
        />
        {error && (
          <p id="city-error" className="weather__error" role="alert">
            {error}
          </p>
        )}
        <div className="input__btns button">
          <button type="submit" className="button__search" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
          <button type="button" className="button__clear" onClick={clear} disabled={!weather && !error}>
            Clear
          </button>
        </div>
      </form>

      {weather && (
        <div className="weather__content" aria-live="polite">
          <h3 className="weather__city">
            {weather.city} {weather.country && <span>{weather.country}</span>}
          </h3>
          <div className="weather__info info">
            <div className="info__temp">
              <p>{weather.temp.toFixed(1)}°C</p>
              {weather.icon && (
                <img
                  className="info__img"
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width="60"
                  height="60"
                />
              )}
            </div>
          </div>
          <dl className="weather__details details details--active">
            <div>
              <dt>Feels like:</dt> <dd>{weather.feelsLike.toFixed(1)}°C</dd>
            </div>
            <div>
              <dt>Pressure:</dt> <dd>{hPaToMmHg(weather.pressure)} mmHg</dd>
            </div>
            <div>
              <dt>Humidity:</dt> <dd>{weather.humidity} %</dd>
            </div>
            <div>
              <dt>Wind:</dt> <dd>{weather.windSpeed.toFixed(1)} m/s</dd>
            </div>
            <div>
              <dt>Wind direction:</dt> <dd>{windDirection(weather.windDeg)}</dd>
            </div>
            <div>
              <dt>Sunrise:</dt> <dd>{cityTime(weather.sunrise, weather.timezone)}</dd>
            </div>
            <div>
              <dt>Sunset:</dt> <dd>{cityTime(weather.sunset, weather.timezone)}</dd>
            </div>
            <div>
              <dt>Day duration:</dt> <dd>{dayDuration(weather.sunrise, weather.sunset)}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
