import mongoose from "mongoose";
const { Schema } = mongoose;
const LikeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, template: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

export default Like;
