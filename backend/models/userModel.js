import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
      required: false,
    },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdTemplates: [{ type: Schema.Types.ObjectId, ref: "Template" }],
    filledForms: [{ type: Schema.Types.ObjectId, ref: "FilledForm" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
