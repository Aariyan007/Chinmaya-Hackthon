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

app.get("/",(req,res)=>{
    // console.log("Hello world");
    res.send("Hello world");
})

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

        res.json({
            lat,
            lng,
            severity: aiRes.data.severity,
            confidence: aiRes.data.confidence
        });

    } catch (err) {
        res.status(500).json({ error: "AI service failed" });
    }
});


app.listen(5001, () => {
    console.log("Node server running on http://localhost:5001");
});
// setInterval(() => {
//   console.log("backend alive");
// }, 5000);
