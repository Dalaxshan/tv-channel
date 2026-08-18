import { model, models, Schema } from "mongoose";

const dayParts = ["Morning", "Afternoon", "Evening", "Night"] as const;

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const Genres = [
  "Reality",
  "Music",
  "Comedy",
  "Drama",
  "Sports",
  "Religious",
  "Kids",
  "Entertainment",
] as const;

const TvScheduleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    dayPart: {
      type: String,
      required: true,
      enum: dayParts,
    },
    week: {
      type: String,
      required: true,
      enum: weekDays,
    },
    genre: {
      type: String,
      required: true,
      enum: Genres,
    },
    isLive: {
      type: Boolean,  
    },
  },
  { timestamps: true },
);

export default models.TvSchedule || model("TvSchedule", TvScheduleSchema);
