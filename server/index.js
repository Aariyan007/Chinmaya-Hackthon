const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    // console.log("Hello world");
    res.send("Hello world");
})
const MERGE_DISTANCE_METERS = 50;
const potholes = [];

let syncData = null;


app.post("/report-pothole", upload.array("images", 3), async (req, res) => {
    try {
        const { lat, lng } = req.body;

        const form = new FormData();
        req.files.forEach(file => {
            form.append("images", fs.createReadStream(file.path));
        });

        const aiRes = await axios.post(
            "http://127.0.0.1:8000/predict",
            form,
            { headers: form.getHeaders() }
        );

        const pothole = {
            lat,
            lng,
            severity: aiRes.data.severity,
            confidence: aiRes.data.confidence,
            timestamp: Date.now()
        };

        // potholes.push(pothole);
        const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
            const R = 6371000;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) *
                Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
            return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        const severityRank = {
            mild: 1,
            moderate: 2,
            severe: 3
        };

        const existing = potholes.find(p =>
            getDistanceInMeters(
                parseFloat(p.lat),
                parseFloat(p.lng),
                parseFloat(lat),
                parseFloat(lng)
            ) < MERGE_DISTANCE_METERS
        );

        if (existing) {
            // escalate risk
            if (severityRank[aiRes.data.severity] > severityRank[existing.severity]) {
                existing.severity = aiRes.data.severity;
            }
            existing.confidence = Math.max(existing.confidence, aiRes.data.confidence);
            existing.timestamp = Date.now();
        } else {
            potholes.push({
                lat,
                lng,
                severity: aiRes.data.severity,
                confidence: aiRes.data.confidence,
                timestamp: Date.now()
            });
        }

        res.json(pothole);


    } catch (err) {
        res.status(500).json({ error: "AI service failed" });
    }
});

app.get("/potholes", (req, res) => {
    res.json(potholes);
});
app.delete("/potholes", (req, res) => {
    potholes.length = 0; // clears array in-place
    res.json({ success: true, message: "All potholes cleared" });
});
app.post("/sync", (req, res) => {
  syncData = req.body;
  res.json({ status: "saved" });
});

// Follower reads data here
app.get("/sync", (req, res) => {
  res.json(syncData);
});

app.listen(5001, () => {
    console.log("Node server running on http://localhost:5001");
});
// setInterval(() => {
//   console.log("backend alive");
// }, 5000);
