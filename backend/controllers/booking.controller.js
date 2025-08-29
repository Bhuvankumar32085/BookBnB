import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

export const createBooking = async (req, res) => {
  try {
    let { id } = req.params;
    let { startDate, endDate, totalAmount } = req.body;

    let listing = await Listing.findById(id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid start/ end date" });
    }

    if (listing.isBooked) {
      return res
        .status(400)
        .json({ success: false, message: "Listing already booked" });
    }

    let booking = await Booking.create({
      guest: req.userId,
      host: listing.host,
      startDate,
      endDate,
      listing: listing._id,
      totalAmount,
    });

    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: { bookings: listing._id },
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    listing.guest = user._id;
    listing.isBooked = true;
    await listing.save();

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

    // Create booking logic here
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { listingId } = req.params;
    const booking = await Booking.findOneAndDelete({ listing: listingId });
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    let guest = await User.findByIdAndUpdate(booking.guest, {
      $pull: { bookings: listingId },
    });

    let listing = await Listing.findByIdAndUpdate(
      listingId,
      {
        $set: { isBooked: false, guest: null },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      listing,
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Listing ID is required" });
    }
    const booking = await Booking.findOne({ listing: id })
      .populate("guest")
      .populate("host")
      .populate("listing");
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
