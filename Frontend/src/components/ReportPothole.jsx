import { useState } from "react";
import { ref, push, update, get } from "firebase/database";
import { db, auth } from "../firebase";

import LocationSection from "./LocationSection";
import UploadBanner from "./UploadBanner";

export default function ReportPothole() {
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitReport = async () => {
    if (!location || !image) {
      alert("Location and image required");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    const userId = user.uid;

    try {
      setLoading(true);

      // ==========================
      // 1️⃣ AI Backend Call
      // ==========================
      const formData = new FormData();
      formData.append("images", image);
      formData.append("lat", location.lat);
      formData.append("lng", location.lon);

      const response = await fetch(
        "http://localhost:5001/report-pothole",
        {
          method: "POST",
          body: formData,
        }
      );

      const aiData = await response.json();
      setResult(aiData);

      // ==========================
      // 2️⃣ Get Username from Firebase DB
      // ==========================
      const userSnap = await get(ref(db, `users/${userId}`));

      if (!userSnap.exists()) {
        alert("User record not found.");
        return;
      }

      const userData = userSnap.val();
      const username = userData.username;

      // ==========================
      // 3️⃣ Create Report in Firebase
      // ==========================
      const newReportRef = push(ref(db, "reports"));
      const reportId = newReportRef.key;

      await update(newReportRef, {
        reportId,
        userId,
        username,
        location: location.address && location.address.trim() ? location.address : "Unknown Location",
        latitude: location.lat,
        longitude: location.lon,
        severity: aiData.severity || "Unknown",
        confidence: aiData.confidence || "N/A",
        status: "Pending",
        coinsAwarded: 50,
        createdAt: Date.now(),
      });

      // ==========================
      // 4️⃣ Update User Stats
      // ==========================
      await update(ref(db, `users/${userId}`), {
        coins: (userData.coins || 0) + 50,
        reports: (userData.reports || 0) + 1,
      });

      alert("Report submitted successfully! +50 Coins 🎉");

      setImage(null);

    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LocationSection onLocation={setLocation} />
      <UploadBanner onFile={setImage} />

      <button
        onClick={submitReport}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 hover:bg-red-700 transition"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>

      {result && (
        <div className="bg-white p-4 rounded-xl shadow">
          <p><strong>Severity:</strong> {result.severity}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
