import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  addListing,
  deleteListing,
  getAllListings,
  rateListing,
  updateListing,
} from "../controllers/listing.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post(
  "/add",
  checkAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  addListing
);

router.get("/all", getAllListings);
router.delete("/delete/:id", checkAuth, deleteListing);

router.put(
  "/update/:id",
  checkAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  updateListing
);
router.post("/:id/rate", checkAuth, rateListing);

export default router;
