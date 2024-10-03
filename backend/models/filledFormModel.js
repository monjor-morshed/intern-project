import mongoose from "mongoose";
const FilledFormSchema = new Schema(
  {
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },
    filledBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        question: { type: String, required: true },
        answer: { type: Schema.Types.Mixed, required: true },
      },
    ],
  },
  { timestamps: true }
);

const FilledForm = mongoose.model("FilledForm", FilledFormSchema);

export default FilledForm;
