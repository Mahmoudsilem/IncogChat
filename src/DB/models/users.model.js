import mongoose, { Schema } from "mongoose";
import { UserGenders, UserRoles } from "../../common/index.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: true,
    },
    rePassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.User,
    },
    gender: {
      type: String,
      enum: Object.values(UserGenders),
      default: UserGenders.NA,
    },
    conformEmail: Date,
    isDeleted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("User", userSchema);
