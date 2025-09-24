const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  transcript: { type: String, required: true },
  summaryQuiz: {
    type: Object,
    required: true, // contains summary, questions, recommendations
  },
  isSaved: { type: Boolean, default: false },
}, { timestamps: true });

const Transcript = mongoose.model("Transcript", transcriptSchema);

module.exports = Transcript;
