from fastapi import FastAPI, UploadFile, Form 

from fastapi.middleware.cors import CORSMiddleware
from utils.transcription import transcribe_video, transcribe_youtube
from utils.summarization import summarize_text
from utils.quiz_generation import generate_quiz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-video/")
async def upload_video(file: UploadFile):
    path = f"temp_{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())
    transcript = transcribe_video(path)
    summary = summarize_text(transcript)
    quiz = generate_quiz(summary)
    return {"transcript": transcript, "summary": summary, "quiz": quiz}

@app.post("/youtube/")
async def youtube_video(url: str = Form(...)):
    transcript = transcribe_youtube(url)
    summary = summarize_text(transcript)
    quiz = generate_quiz(summary)
    return {"transcript": transcript, "summary": summary, "quiz": quiz}
