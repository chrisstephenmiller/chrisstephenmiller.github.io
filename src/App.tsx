import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import LocationSearch from "./components/LocationSearch";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

function App() {
  const [location, setLocation] = useState<Location>({
    lat: 41.95522,
    lng: -87.719374,
    name: "Chicago",
  });
  const [forecastDate, setForecastDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
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
