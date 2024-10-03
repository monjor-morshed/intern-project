import mongoose from "mongoose";
const CommentSchema = new Schema(
  {
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
