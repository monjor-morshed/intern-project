import mongoose from "mongoose";
const { Schema } = mongoose;

const TemplateSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: {
      type: String,
      required: true,
      enum: ["Education", "Quiz", "Other"],
    },
    imageUrl: {
      type: String,
      required: false,
    },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    access: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    selectedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    questions: [
      {
        title: { type: String, required: true },
        description: { type: String },
        type: {
          type: String,
          enum: ["single-line", "multi-line", "integer", "checkbox"],
          required: true,
        },
        displayInTable: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    filledForms: [{ type: Schema.Types.ObjectId, ref: "FilledForm" }],
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", TemplateSchema);
export default Template;
