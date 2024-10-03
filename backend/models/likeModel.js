import mongoose from "mongoose";
const LikeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    template: { type: Schema.Types.ObjectId, ref: "Template", required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ user: 1, template: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);

export default Like;
