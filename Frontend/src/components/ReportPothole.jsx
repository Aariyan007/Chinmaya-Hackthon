import { useState } from "react";
import LocationSection from "./LocationSection";
import UploadBanner from "./UploadBanner";

export default function ReportPothole() {
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const submitReport = async () => {
    console.log("SUBMIT CLICKED");

    if (!location || !image) {
      alert("Location and image required");
      return;
    }

    const formData = new FormData();
    formData.append("images", image);
    formData.append("lat", location.lat);
    formData.append("lng", location.lon);

    const res = await fetch("http://localhost:5001/report-pothole", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="space-y-6">
      <LocationSection onLocation={setLocation} />
      <UploadBanner onFile={setImage} />

      <button
        onClick={submitReport}
        className="bg-red-600 text-white px-6 py-3 rounded-xl"
      >
        Submit Report
      </button>
      

      {result && (
        <div className="bg-white p-4 rounded-xl">
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
