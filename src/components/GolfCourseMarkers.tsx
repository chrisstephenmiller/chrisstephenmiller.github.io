import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface GolfCourse {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface CachedBounds {
  south: number;
  west: number;
  north: number;
  east: number;
  courses: GolfCourse[];
}

// Helper function to check if bounds have significantly changed
const boundsDifferenceThreshold = 0.05; // degrees
const haveBoundsChanged = (
  oldBounds: CachedBounds | null,
  newBounds: { south: number; west: number; north: number; east: number },
): boolean => {
  if (!oldBounds) return true;

  const latDiff = Math.max(
    Math.abs(oldBounds.south - newBounds.south),
    Math.abs(oldBounds.north - newBounds.north),
  );
  const lngDiff = Math.max(
    Math.abs(oldBounds.west - newBounds.west),
    Math.abs(oldBounds.east - newBounds.east),
  );

  return (
    latDiff > boundsDifferenceThreshold || lngDiff > boundsDifferenceThreshold
  );
};

const GolfCourseMarkers: React.FC<{
  onCoursesUpdate?: (courses: GolfCourse[]) => void;
}> = ({ onCoursesUpdate }) => {
  const map = useMap();
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([]);
  const boundsCache = useRef<CachedBounds | null>(null);

  // Notify parent when courses update
  useEffect(() => {
    onCoursesUpdate?.(golfCourses);
  }, [golfCourses, onCoursesUpdate]);

  useEffect(() => {
    const fetchGolfCourses = async () => {
      try {
        // Ensure map is fully loaded before getting bounds
        if (!map.getCenter()) {
          console.warn("Map not ready yet");
          return;
        }

        const bounds = map.getBounds();
        const newBounds = {
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        };

        // Check if bounds have changed significantly
        if (!haveBoundsChanged(boundsCache.current, newBounds)) {
          console.log("Using cached golf courses");
          // Use cached courses
          if (boundsCache.current) {
            setGolfCourses(boundsCache.current.courses);
          }
          return;
        }

        console.log("Fetching golf courses for bounds:", newBounds);

        // Overpass API query for golf courses - using QL format
        const query = `[out:json];
        (
        node["leisure"="golf_course"](${newBounds.south},${newBounds.west},${newBounds.north},${newBounds.east});
        way["leisure"="golf_course"](${newBounds.south},${newBounds.west},${newBounds.north},${newBounds.east});
        relation["leisure"="golf_course"](${newBounds.south},${newBounds.west},${newBounds.north},${newBounds.east});
        );
        out center;`;

        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: query,
            headers: {
              "Content-Type": "text/plain",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Overpass API error: ${response.status}`);
        }

        const data = await response.json();

        console.log("Golf courses found:", data.elements?.length || 0);

        // Parse golf courses from response
        const courses: GolfCourse[] = [];

        data.elements?.forEach((element: any) => {
          let lat, lng, name;

          if (element.type === "node") {
            lat = element.lat;
            lng = element.lon;
          } else if (element.center) {
            lat = element.center.lat;
            lng = element.center.lon;
          }

          if (lat && lng) {
            name = element.tags?.name || "Golf Course";
            courses.push({
              id: `${element.type}-${element.id}`,
              name,
              lat,
              lng,
            });
          }
        });

        // Cache the results with the bounds
        boundsCache.current = { ...newBounds, courses };
        setGolfCourses(courses);
      } catch (error) {
        console.error("Error fetching golf courses:", error);
      }
    };

    // Delay initial fetch to ensure map is ready
    const timeoutId = setTimeout(() => {
      fetchGolfCourses();
    }, 500);

    // Refetch when map moves/zooms
    const handleMoveEnd = () => {
      fetchGolfCourses();
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      clearTimeout(timeoutId);
      map.off("moveend", handleMoveEnd);
    };
  }, [map]);

  return null;
};

export default GolfCourseMarkers;
