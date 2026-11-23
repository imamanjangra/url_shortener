import mongoose, { Schema, Document } from "mongoose";

export interface click extends Document {
  urlId: mongoose.Types.ObjectId;
  browser: string;
  os: string;
  device: string;
  cpu: string;
  country: string;
  region: string;
  city: string;
  latitude: Number;
  longitude: Number;
}

const ClickSchema: Schema<click> = new Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
    index: true,
  },
  browser: String,
  os: String,
  device: String,
  cpu: String,
  country: {
    type: String,
    default: "Unknown",
  },
  region: {
    type: String,
    default: "Unknown",
  },
  city: {
    type: String,
    default: "Unknown",
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
});

export const clickModel =
  (mongoose.models.click as mongoose.Model<click>) ||
  mongoose.model<click>("click", ClickSchema);
