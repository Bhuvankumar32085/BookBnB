import { cloudinary, uploadToCloudinary } from "../configs/cloudinary.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

export const addListing = async (req, res) => {
  try {
    let host = req.userId;
    const { title, description, rent, city, landMark, category } = req.body;

    let result1 = await uploadToCloudinary(req.files.image1[0].path);
    let result2 = await uploadToCloudinary(req.files.image2[0].path);
    let result3 = await uploadToCloudinary(req.files.image3[0].path);

    const listing = new Listing({
      title,
      description,
      rent,
      city,
      landMark,
      category,
      host,
      image1: { publicId: result1.public_id, url: result1.secure_url },
      image2: { publicId: result2.public_id, url: result2.secure_url },
      image3: { publicId: result3.public_id, url: result3.secure_url },
    });

    await listing.save();

    let user = await User.findById(host);
    user.listing.push(listing._id);
    await user.save();

    res.status(201).json({
      success: true,
      listing,
      message: "Listing added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding listing", error });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching listings", error });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting listing", error });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, rent, city, landMark } = req.body;

    let listing = await Listing.findById(id);

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    if (req.files && req.files.image1) {
      if (listing.image1 && listing.image1.publicId) {
        await cloudinary.uploader.destroy(listing.image1.publicId);
      }
      let result1 = await uploadToCloudinary(req.files.image1[0].path);
      listing.image1 = {
        publicId: result1.public_id,
        url: result1.secure_url,
      };
    }

    if (req.files && req.files.image2) {
      if (listing.image2 && listing.image2.publicId) {
        await cloudinary.uploader.destroy(listing.image2.publicId);
      }
      let result2 = await uploadToCloudinary(req.files.image2[0].path);
      listing.image2 = {
        publicId: result2.public_id,
        url: result2.secure_url,
      };
    }

    if (req.files && req.files.image3) {
      if (listing.image3 && listing.image3.publicId) {
        await cloudinary.uploader.destroy(listing.image3.publicId);
      }
      let result3 = await uploadToCloudinary(req.files.image3[0].path);
      listing.image3 = {
        publicId: result3.public_id,
        url: result3.secure_url,
      };
    }

    listing.title = title;
    listing.description = description;
    listing.rent = rent;
    listing.city = city;
    listing.landMark = landMark;

    await listing.save();

    res.status(200).json({
      success: true,
      updatedData: listing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating listing", error });
  }
};

export const rateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    listing.rating = rating;
    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing rated successfully",
    });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({
      success: false,
      message: "Error rating listing",
      error: error.message,
    });
  }
};
