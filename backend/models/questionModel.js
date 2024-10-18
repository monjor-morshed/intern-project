import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["single-line", "multi-line", "integer", "checkbox"],
    required: true,
  },
  displayInTable: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
});

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
