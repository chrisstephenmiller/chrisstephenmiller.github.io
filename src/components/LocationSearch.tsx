import { useState } from "react";
import "./LocationSearch.css";

// Convert 24-hour format to 12-hour AM/PM format
const formatHourTo12 = (hour: number): string => {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${period}`;
};

interface LocationSearchProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;
  forecastDate: string;
  onForecastDateChange: (date: string) => void;
  forecastHour: number;
  onForecastHourChange: (hour: number) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  forecastDate,
  onForecastDateChange,
  forecastHour,
  onForecastHourChange,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    try {
      // Using Nominatim (OpenStreetMap) free geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput,
        )}&format=json&limit=1`,
      );

      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        onLocationSelect({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name.split(",")[0],
        });
        setSearchInput("");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  return (
    <form className="location-search" onSubmit={handleSearch}>
      <div className="search-row">
        <input
          type="text"
          placeholder="Location"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        <div className="forecast-date">
          <input
            id="forecast-date"
            type="date"
            value={forecastDate}
            onChange={(e) => onForecastDateChange(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="forecast-time">
          <label htmlFor="forecast-hour">
            Time: {formatHourTo12(forecastHour)}
          </label>
          <input
            id="forecast-hour"
            type="range"
            min="0"
            max="23"
            value={forecastHour}
            onChange={(e) => onForecastHourChange(parseInt(e.target.value))}
            className="time-slider"
          />
        </div>
      </div>
    </form>
  );
};

export default LocationSearch;
