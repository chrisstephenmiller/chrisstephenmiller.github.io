import { useEffect, useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./WeatherMarker.css";

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

interface WeatherMarkerProps {
  location: {
    lat: number;
    lng: number;
  };
  courseName: string;
  forecastDate: string;
  forecastHour: number;
}

// Module-level cache for weather queries
// Key format: "lat,lng,date" (date only, no hour)
// Value: array of WeatherData for all 24 hours (index 0-23)
const weatherCache = new Map<string, WeatherData[]>();

const createWeatherCacheKey = (
  lat: number,
  lng: number,
  date: string,
): string => {
  return `${lat.toFixed(4)},${lng.toFixed(4)},${date}`;
};

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "⛅";
  if ([3, 45, 48, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return "☁️";
  if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
};
const getRainEmoji = (code: number): string => {
  if ([51, 53, 55].includes(code)) return "💧";
  if ([61, 63, 65].includes(code)) return "💧💧";
  if ([80, 81, 82].includes(code)) return "💧💧💧";
  return "";
};

const WeatherMarker: React.FC<WeatherMarkerProps> = ({
  location,
  courseName,
  forecastDate,
  forecastHour,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [icon, setIcon] = useState<L.Icon | null>(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = createWeatherCacheKey(
        location.lat,
        location.lng,
        forecastDate,
      );

      // Check if data is already cached for this date
      if (weatherCache.has(cacheKey)) {
        console.log("Using cached weather data:", cacheKey);
        const dayData = weatherCache.get(cacheKey)!;
        setWeather(dayData[forecastHour]);
        return;
      }

      // Prevent duplicate fetches for the same query
      if (fetchInProgress.current) {
        return;
      }

      fetchInProgress.current = true;

      try {
        // Fetch hourly forecast data from Open-Meteo API
        // API returns all 24 hours for the given date in one call
        // Cache the entire day so hour slider changes don't require refetching
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&start_date=${forecastDate}&end_date=${forecastDate}&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`,
        );
        const data = await response.json();

        // Build an array of WeatherData for all 24 hours
        if (data.hourly && data.hourly.time && data.hourly.temperature_2m) {
          const dayData: WeatherData[] = [];
          for (let i = 0; i < data.hourly.time.length; i++) {
            dayData[i] = {
              temperature: Math.round(data.hourly.temperature_2m[i]),
              weatherCode: data.hourly.weather_code[i],
            };
          }

          // Cache the entire day's worth of data
          weatherCache.set(cacheKey, dayData);
          setWeather(dayData[forecastHour]);
          console.log("Fetched and cached weather for all hours:", cacheKey);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        fetchInProgress.current = false;
      }
    };

    fetchWeather();
  }, [location, forecastDate, forecastHour]);

  // Create custom icon with weather or golf course info
  useEffect(() => {
    let html: string;
    console.log(weather);
    if (weather) {
      // Show weather info
      html = `
        <div class="course-marker-icon">
          <div class="course-marker-emoji">${getWeatherEmoji(weather.weatherCode)}</div>
          <div class="course-rain-emoji">${getRainEmoji(weather.weatherCode)}</div>
          <div class="course-marker-temp">${weather.temperature}°</div>
        </div>
      `;
    } else {
      // Show golf course marker
      html = `
        <div class="course-marker-icon">
          <div class="course-marker-emoji">⛳</div>
        </div>
      `;
    }

    const customIcon = L.divIcon({
      html: html,
      className: "course-marker-container",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    setIcon(customIcon as any);
  }, [weather]);

  if (!icon) {
    return null;
  }

  return (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      <Popup>{courseName}</Popup>
    </Marker>
  );
};

export default WeatherMarker;
