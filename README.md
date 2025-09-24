Quivid - The AI-Powered Video Quiz Generator
Quivid is a full-stack web application that transforms educational videos into interactive learning modules. Users can provide a YouTube link or upload a video file, and Quivid automatically generates a transcript, a summary, and a quiz to test their knowledge. All of this is accomplished using 100% free and open-source AI models and services.

Features
Video Input: Supports direct video uploads and YouTube links.

Automatic Transcription: Uses the YouTube Transcript API or a locally run open-source model like Whisper.

AI-Powered Summarization: Employs Hugging Face's bart-large-cnn model to create concise summaries.

Automatic Quiz Generation: Generates multiple-choice questions from the summary using a T5-based model.

Performance Tracking: Saves quiz results to Firebase Firestore (free tier) and visualizes progress with Recharts.

Modern Tech Stack: Built with React for the frontend and a Python (Flask) backend.

Project Structure
quivid/
├── backend/
│   ├── app.py              # Flask server for AI processing
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── package.json        # Node.js dependencies
│   └── src/
│       └── App.jsx         # Main React application component
└── README.md               # This file

Setup & Installation
Prerequisites
Python 3.8+ and Pip

Node.js 16+ and npm

A Google Firebase account for the database (free "Spark" plan is sufficient).

1. Backend Setup (Flask)
Navigate to the backend directory:

cd backend

# 1. Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the backend server
flask run

The backend API will now be running at http://127.0.0.1:5000. The first time you run it, the Hugging Face models will be downloaded, which may take some time.

2. Frontend Setup (React)
First, create a new React app and replace its src directory with the provided files.

# 1. Create a new React app
npx create-react-app frontend

# 2. Navigate into the project directory
cd frontend

# 3. Install required libraries
npm install axios recharts firebase

# 4. Replace the contents of `frontend/src/App.js` with the code from `App.jsx` provided.
#    You may also need to rename App.js to App.jsx.

# 5. Firebase Configuration
#    - Go to your Firebase project settings.
#    - Find your web app's configuration object.
#    - Paste this object into the `firebaseConfig` variable in `frontend/src/App.jsx`.

# 6. Start the frontend development server
npm start

The React app will open automatically in your browser at http://localhost:3000.

How to Use
Open the web app in your browser.

Paste a YouTube video URL into the input field.

Click "Generate Study Hub".

The app will process the video and display the video player, transcript, summary, and a quiz.

Take the quiz and submit it to see your score and track your performance over time.

Free Tier & Deployment Notes
Hugging Face Models: These run on your local machine and are completely free. For deployment, you could host the Flask backend on a platform like Hugging Face Spaces or a free-tier cloud VM.

Firebase: The Firestore database is used for performance tracking and has a generous free tier suitable for personal use and small projects.

Frontend Deployment: The React app can be deployed for free on platforms like Vercel or Netlify.