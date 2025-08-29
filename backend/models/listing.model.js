import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    image1: {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },
    image2: {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },
    image3: {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },
    rent: { type: Number, required: true },
    city: { type: String, required: true },
    landMark: { type: String, required: true },
    category: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
