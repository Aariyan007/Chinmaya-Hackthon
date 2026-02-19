import { useState } from "react";

export default function LocationSection() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setLocation({ lat, lon });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setAddress(data.display_name);
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">

      <h2 className="text-xl font-bold text-blue-600 mb-4">
        📍 Detect Location Automatically
      </h2>

      <button
        onClick={getLocation}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Use My Current Location
      </button>

      {location && (
        <div className="mt-6 space-y-2">
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
          <p><strong>Address:</strong> {address}</p>

          <iframe
            title="map"
            width="100%"
            height="250"
            className="rounded-xl mt-4"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lon-0.01}%2C${location.lat-0.01}%2C${location.lon+0.01}%2C${location.lat+0.01}&layer=mapnik&marker=${location.lat}%2C${location.lon}`}
          />
        </div>
      )}
    </div>
  );
}
