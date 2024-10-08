import mongoose from "mongoose";
const { Schema } = mongoose;
const TagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    templates: [{ type: Schema.Types.ObjectId, ref: "Template" }],
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
