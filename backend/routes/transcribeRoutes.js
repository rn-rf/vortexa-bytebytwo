const express = require("express");
const {
  upload,
  uploadVideo,
  transcribeYoutube,
} = require("../controllers/trinscribeCrontroller");

const router = express.Router();

// POST /api/transcriptions/upload
router.post("/upload", upload.single("video"), uploadVideo);

// POST /api/transcriptions/youtube
router.post("/youtube", transcribeYoutube);

module.exports = router;
