import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import WeatherGrid from "./WeatherGrid";
import GolfCourseMarkers from "./GolfCourseMarkers";
import LoadingSpinner from "./LoadingSpinner";

import "./Map.css";

interface GolfCourse {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// Fix Leaflet icon issue with webpack
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

interface MapProps {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  forecastDate: string;
  forecastHour: number;
}

function MapUpdater({
  location,
}: {
  location: { lat: number; lng: number; name: string };
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([location.lat, location.lng], 12);
  }, [location, map]);

  return null;
}

const Map: React.FC<MapProps> = ({ location, forecastDate, forecastHour }) => {
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="map-container">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={12}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]} icon={DefaultIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
        <MapUpdater location={location} />
        <GolfCourseMarkers
          onCoursesUpdate={setGolfCourses}
          onLoadingChange={setIsLoading}
        />
        {golfCourses.length > 0 && (
          <WeatherGrid
            golfCourses={golfCourses}
            forecastDate={forecastDate}
            forecastHour={forecastHour}
          />
        )}
      </MapContainer>
      <LoadingSpinner isLoading={isLoading} />
    </div>
  );
};

export default Map;
