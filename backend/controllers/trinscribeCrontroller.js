const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const playdl = require('play-dl');
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_BASE = "https://api.assemblyai.com/v2";
const {getUserIdFromToken} = require("../utilities/utils");
// Polyfill fetch, Headers, Request, and Response for Node < 18
const fetch = require("node-fetch");
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;
const { FormData, File } = require("formdata-node");

//models
const Transcript = require("../models/transcribeModel");
const User = require("../models/userModel");

// Polyfill globals for OpenAI SDK
globalThis.FormData = FormData;
globalThis.File = File;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Updated function to use structured JSON output
const generateSummaryAndQuiz = async (transcriptText) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;
  
  const prompt = `
You are an expert teacher.

Given the following lecture transcript, output ONLY a valid JSON object, no explanations, no markdown, no extra text:

1. Write a concise, clear summary of the topic (max 150 words) in the "summary" field.
2. Create 5 multiple-choice questions with their options and correct answer in the "questions" field.
3. Suggest 3 related topics with resource links in the "recommendations" field.

The JSON format MUST be exactly like this:

{
  "summary": "summary text here",
  "questions": [
    { "question": "?", "options": ["A","B","C","D"], "answer": "A" },
    ...
  ],
  "recommendations": [
    { "topic": "topic name", "link": "https://..." },
    ...
  ]
}

Transcript:
${transcriptText}
`;

  const headers = {
    'Content-Type': 'application/json',
    'X-goog-api-key': GEMINI_API_KEY
  };

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      // This is the key change: enforces a JSON response
      responseMimeType: "application/json",
      maxOutputTokens: 1000,
    },
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      console.error("No JSON data received from Gemini API.");
      return null;
    }

    try {
      // The model should now return clean JSON, so we can parse directly
      return JSON.parse(rawText);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", err.message);
      console.log("Raw text that failed parsing:", rawText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
    return null;
  }
};

async function downloadYouTubeVideo(url, outputPath) {
  try {
    const video = await playdl.video_info(url);
    const stream = await playdl.stream_from_info(video);
    const fileStream = fs.createWriteStream(outputPath);
    
    // Pipe the video stream to the file
    stream.pipe(fileStream);
    
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    console.log(`Downloaded: ${video.title}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const upload = multer({ dest: "uploads/" });

function videoToAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", reject)
      .run();
  });
}

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

async function pollTranscription(transcriptId) {
  while (true) {
    const res = await axios.get(
      `${ASSEMBLYAI_BASE}/transcript/${transcriptId}`,
      { headers: { authorization: ASSEMBLYAI_API_KEY } }
    );

    if (res.data.status === "completed") return res.data;
    if (res.data.status === "error") throw new Error(res.data.error);

    await new Promise((r) => setTimeout(r, 5000));
  }
}

async function uploadVideo(req, res) {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `${Date.now()}.mp3`);

    await videoToAudio(inputPath, outputPath);
    const audioUrl = await uploadToAssemblyAI(outputPath);
    const transcriptId = await requestTranscription(audioUrl);
    const transcript = await pollTranscription(transcriptId);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    const geminiResult = await generateSummaryAndQuiz(transcript.text);

    if (!geminiResult) {
      return res.status(500).json({ error: "Failed to generate summary and quiz from LLM." });
    }

    res.json({ transcript: transcript.text, summaryQuiz: geminiResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


async function uploadVideoWithId(req, res) {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `${Date.now()}.mp3`);

    const token = req.headers.token; // usually sent as Bearer <token>
    const userId = getUserIdFromToken(token);

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }


    await videoToAudio(inputPath, outputPath);
    const audioUrl = await uploadToAssemblyAI(outputPath);
    const transcriptId = await requestTranscription(audioUrl);
    const transcript = await pollTranscription(transcriptId);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    const geminiResult = await generateSummaryAndQuiz(transcript.text);

    if (!geminiResult) {
      return res.status(500).json({ error: "Failed to generate summary and quiz from LLM." });
    }

    const newDoc = await Transcript.create({
      transcript: transcript.text,
      summaryQuiz: geminiResult,
      isSaved: false, // you can set default as true
    });


    res.json({ 
      transcript: transcript.text, 
      summaryQuiz: geminiResult,
      uid: newDoc.uid, // or newDoc._id if you prefer
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function markAsSaved(req, res) {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: "Missing transcript ID" });
    }

    // Find the document and update its isSaved field to true
    const updatedDoc = await Transcript.findOneAndUpdate(
      { uid },           // filter by uid
      { isSaved: true }, // update
      { new: true }      // return the updated document
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    res.json({ message: "Transcript marked as saved", transcript: updatedDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getUserTranscripts(req, res) {
  try {
    const token = req.headers.token; // usually sent as Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, missing token" });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    // Fetch all transcripts for this user
    const transcripts = await Transcript.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, transcripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getSavedTranscripts(req, res) {
  try {
    const token = req.headers.token; // usually sent as Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, missing token" });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    // Fetch all transcripts that are saved for this user
    const savedTranscripts = await Transcript.find({ userId, isSaved: true }).sort({ createdAt: -1 });

    res.json({ success: true, savedTranscripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function updateUserScore(req, res) {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, missing token" });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    const { score } = req.body; // latest quiz score (e.g., 0-100)
    if (score == null || isNaN(score)) {
      return res.status(400).json({ message: "Invalid score provided" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize fields if not present
    if (!user.totalQuizzes) user.totalQuizzes = 0;
    if (!user.averageScore) user.averageScore = 0;

    // Calculate new average
    const newTotalQuizzes = user.totalQuizzes + 1;
    const newAverageScore = ((user.averageScore * user.totalQuizzes) + score) / newTotalQuizzes;

    // Update user
    user.totalQuizzes = newTotalQuizzes;
    user.averageScore = newAverageScore;

    await user.save();

    res.json({
      success: true,
      message: "User score updated",
      totalQuizzes: user.totalQuizzes,
      averageScore: user.averageScore.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function transcribeYoutube(req, res) {
  try {
    const { url } = req.body;
    const inputPath = path.join("uploads", `${Date.now()}.mp4`);
    const outputPath = path.join("uploads", `${Date.now()}.mp3`);

    try {
      await downloadYouTubeVideo(url, inputPath);
    } catch (err) {
      console.error("Failed to download YouTube video:", err.message);
      return res.status(500).json({ error: "Failed to download video" });
    }

    await videoToAudio(inputPath, outputPath);
    const audioUrl = await uploadToAssemblyAI(outputPath);
    const transcriptId = await requestTranscription(audioUrl);
    const transcript = await pollTranscription(transcriptId);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    const geminiResult = await generateSummaryAndQuiz(transcript.text);

    if (!geminiResult) {
      return res.status(500).json({ error: "Failed to generate summary and quiz from LLM." });
    }

    res.json({ transcript: transcript.text, summaryQuiz: geminiResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  upload,
  uploadVideo,
  transcribeYoutube,
  uploadVideoWithId,
  markAsSaved,
  getUserTranscripts,
  getSavedTranscripts,
  updateUserScore
};
