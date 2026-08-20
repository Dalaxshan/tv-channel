import { model, models, Schema } from "mongoose";

const HeroSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    liveButton: {
      type: String,
      required: true,
    },
    exploreButton: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default models.Hero || model("Hero", HeroSchema);
