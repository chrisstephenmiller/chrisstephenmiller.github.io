import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import LocationSearch from "./components/LocationSearch";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

// Get today's date in local timezone as YYYY-MM-DD string
const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function App() {
  const [location, setLocation] = useState<Location>({
    lat: 41.95522,
    lng: -87.719374,
    name: "Chicago",
  });
  const [forecastDate, setForecastDate] =
    useState<string>(getLocalDateString());
  const [forecastHour, setForecastHour] = useState<number>(12);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>⛳ Golf Whether</h1>
        <LocationSearch
          onLocationSelect={setLocation}
          forecastDate={forecastDate}
          onForecastDateChange={setForecastDate}
          forecastHour={forecastHour}
          onForecastHourChange={setForecastHour}
        />
      </header>

      <main className="app-main">
        <div className="map-wrapper">
          <Map
            location={location}
            forecastDate={forecastDate}
            forecastHour={forecastHour}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Golf Whether App</p>
      </footer>
    </div>
  );
}

export default App;
