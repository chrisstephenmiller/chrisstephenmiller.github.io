import WeatherMarker from "./WeatherMarker";

interface GolfCourse {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface WeatherGridProps {
  golfCourses: GolfCourse[];
  forecastDate: string;
  forecastHour: number;
}

const WeatherGrid: React.FC<WeatherGridProps> = ({
  golfCourses,
  forecastDate,
  forecastHour,
}) => {
  return (
    <>
      {golfCourses.map((course) => (
        <WeatherMarker
          key={course.id}
          location={{
            lat: course.lat,
            lng: course.lng,
          }}
          courseName={course.name}
          forecastDate={forecastDate}
          forecastHour={forecastHour}
        />
      ))}
    </>
  );
};

export default WeatherGrid;
