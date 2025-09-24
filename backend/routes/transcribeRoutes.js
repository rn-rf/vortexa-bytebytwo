const express = require("express");
const {
  upload,
  uploadVideo,
  transcribeYoutube,
  markAsSaved,
  getUserTranscripts,
  getSavedTranscripts,
  updateUserScore,
} = require("../controllers/trinscribeCrontroller");

const router = express.Router();

// POST /api/transcriptions/upload
router.post("/upload", upload.single("video"), uploadVideo);

//upload with id
router.post("/uploadWithId", upload.single("video"), uploadVideo);

// POST /api/transcriptions/youtube
router.post("/youtube", transcribeYoutube);

//save with id
router.post("/saveTranscript:id", markAsSaved);

//fetch all with id
router.get("/getAllTranscripts", getUserTranscripts);

//fetch saved with id
router.get("/getSavedTranscripts", getSavedTranscripts);

//update score
router.post("/updateScore", updateUserScore);

module.exports = router;
