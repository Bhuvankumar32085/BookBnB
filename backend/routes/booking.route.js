import express from "express";
import {
  cancelBooking,
  createBooking,
  getBookingDetails,
} from "../controllers/booking.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/create/:id", checkAuth, createBooking);
router.delete("/cancel/:listingId", checkAuth, cancelBooking);
router.get("/details/:id", checkAuth, getBookingDetails);

export default router;
