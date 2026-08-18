import { model, models, Schema } from "mongoose";

const Genres = [
  "Latest",
  "Breaking",
  "Politics",
  "Economy",
  "Weather",
  "Sports",
  "Lifestyle",
  "Technology",
] as const;
const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      enum: Genres,
      required: true,
    },
    newsUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.News || model("News", NewsSchema);
