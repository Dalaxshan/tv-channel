import { model, models, Schema } from "mongoose";

const LivetvSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.LiveTv || model("LiveTv", LivetvSchema);
