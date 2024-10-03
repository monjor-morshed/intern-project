import mongoose from "mongoose";
const TemplateSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: { type: String, required: true },
    imageUrl: { type: String }, // Optional field for image/illustration URL
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    access: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    selectedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Optional for private templates
    fields: [
      {
        title: { type: String, required: true },
        description: { type: String },
        displayInTable: { type: Boolean, default: false }, // If true, show in filled form table
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    filledForms: [{ type: Schema.Types.ObjectId, ref: "FilledForm" }],
  },
  { timestamps: true }
);
const Template = mongoose.model("Template", TemplateSchema);
export default Template;