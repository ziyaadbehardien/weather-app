import { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

const RAINVIEWER_INDEX = 'https://api.rainviewer.com/public/weather-maps.json';

/**
 * Latest precipitation radar frame from RainViewer (free, no API key).
 */
export default function RadarLayer() {
  const [framePath, setFramePath] = useState(null);

  useEffect(() => {
    let active = true;
    fetch(RAINVIEWER_INDEX)
      .then((res) => res.json())
      .then((index) => {
        const frames = index?.radar?.past;
        const latest = frames?.[frames.length - 1];
        if (active && latest?.path) setFramePath(latest.path);
      })
      .catch(() => {
        // radar is best-effort; the base map still works without it
      });
    return () => {
      active = false;
    };
  }, []);

  if (!framePath) return null;

  return (
    <TileLayer
      url={`https://tilecache.rainviewer.com${framePath}/256/{z}/{x}/{y}/2/1_1.png`}
      opacity={0.7}
      attribution='Radar &copy; <a href="https://www.rainviewer.com/">RainViewer</a>'
    />
  );
}
