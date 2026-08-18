import { model, models, Schema } from "mongoose";

const Badges = ["Featured", "New", "Trending"] as const;
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

const ProgramSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: Genres,
      required: true,
    },
    badges: {
      type: [String],
      enum: Badges,
      default: [],
    },
    duration: {
      type: String,
      required: true,
    },
    episodeUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.Program || model("Program", ProgramSchema);