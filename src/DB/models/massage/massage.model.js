import { Schema, SchemaTypes, model } from "mongoose";

const schema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        if (this.attachments.length) {
          return true;
        }
        return false;
      },
    },
    attachments: {
      type: [{ public_id: String, secure_url: String }],
      required: function () {
        if (this.content === "" || !this.content) {
          return true;
        }
        return false;
      },
      default: [],
    },
    recevier: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default model("Massage", schema);
