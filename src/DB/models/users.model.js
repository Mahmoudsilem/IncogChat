import mongoose, { Schema } from "mongoose";
import { UserGenders, UserProviders, UserRoles } from "../../common/index.js";

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
      required: function () {
        return this.provider === UserProviders.system;
      },
    },
    rePassword: {
      type: String,
    },
    provider: {
      type: String,
      enum: Object.values(UserProviders),
      default: UserProviders.system,
    },
    phone: {
      type: String,
      required: function () {
        return this.provider === UserProviders.system;
      },
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
    // profilePic: {
    //   type: String,
    // },
    // coverPics: {
    //   type: [String],
    //   // maxLength: 2,
    // },
    profilePic: {
      type: { public_id: String, secure_url: String },
    },
    coverPics: {
      type: [{ public_id: String, secure_url: String }],
    },
    gallary: {
      type: [{ public_id: String, secure_url: String }],
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
