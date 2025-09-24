const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytdl = require("ytdl-core");
const playdl = require('play-dl');

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_BASE = "https://api.assemblyai.com/v2";


async function downloadYouTubeVideo(url, outputPath) {
  try {
    // Fetch video information
    const video = await playdl.video_info(url);
    const stream = await playdl.stream_from_info(video);
    
    // Create a writable stream to save the video
    const fileStream = fs.createWriteStream(outputPath);
    
    // Pipe the video stream to the file
    stream.pipe(fileStream);
    
    fileStream.on('finish', () => {
      console.log(`Downloaded: ${video.title}`);
    });
    
    fileStream.on('error', (err) => {
      console.error('Error downloading video:', err);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Multer instance (export if you want to use in routes)
const upload = multer({ dest: "uploads/" });

/**
 * Helper: Convert video to audio (mp3)
 */
function videoToAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .run();
  });
}

/**
 * Helper: Upload audio to AssemblyAI
 */
async function uploadToAssemblyAI(filePath) {
  const data = fs.readFileSync(filePath);

  const response = await axios.post(
    `${ASSEMBLYAI_BASE}/upload`,
    data,
    {
      headers: {
        "authorization": ASSEMBLYAI_API_KEY,
        "transfer-encoding": "chunked",
      },
    }
  );

  return response.data.upload_url;
}

/**
 * Helper: Request transcription
 */
async function requestTranscription(audioUrl) {
  const response = await axios.post(
    `${ASSEMBLYAI_BASE}/transcript`,
    { audio_url: audioUrl },
    {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    }
  );

  return response.data.id;
}

/**
 * Helper: Poll transcription until done
 */
async function pollTranscription(transcriptId) {
  while (true) {
    const res = await axios.get(
      `${ASSEMBLYAI_BASE}/transcript/${transcriptId}`,
      { headers: { authorization: ASSEMBLYAI_API_KEY } }
    );

    if (res.data.status === "completed") return res.data;
    if (res.data.status === "error") throw new Error(res.data.error);

    await new Promise((r) => setTimeout(r, 5000)); // wait 5s
  }
}

/**
 * Controller: Upload video file
 */
async function uploadVideo(req, res) {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `${Date.now()}.mp3`);

    await videoToAudio(inputPath, outputPath);
    const audioUrl = await uploadToAssemblyAI(outputPath);
    const transcriptId = await requestTranscription(audioUrl);
    const transcript = await pollTranscription(transcriptId);

    // cleanup
    // fs.unlinkSync(inputPath);
    // fs.unlinkSync(outputPath);

    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * Controller: Transcribe YouTube URL
 */
async function transcribeYoutube(req, res) {
  try {
    const { url } = req.body;
    // if (!ytdl.validateURL(url)) {
    //   return res.status(400).json({ error: "Invalid YouTube URL" });
    // }

    const inputPath = path.join("uploads", `${Date.now()}.mp4`);
    const outputPath = path.join("uploads", `${Date.now()}.mp3`);

    // Download YouTube video
   
      try {
        // await ytdl(url, { quality: "highestaudio" })
        //   .pipe(fs.createWriteStream(inputPath));
        await downloadYouTubeVideo(url, inputPath);
      } catch (err) {
        console.error("Failed to download YouTube video:", err.message);
        return res.status(500).json({ error: "Failed to download video" });
      }

    await videoToAudio(inputPath, outputPath);
    const audioUrl = await uploadToAssemblyAI(outputPath);
    const transcriptId = await requestTranscription(audioUrl);
    const transcript = await pollTranscription(transcriptId);

    // cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  upload,
  uploadVideo,
  transcribeYoutube,
};
