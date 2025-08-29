import React from "react";
import { useDispatch, useSelector } from "react-redux";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { GoLocation } from "react-icons/go";
import { setClickedCard } from "../redux/slices/listingSlice";
import { useNavigate } from "react-router-dom";

const FillterListed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedListing, listings } = useSelector((store) => store.listing);

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-lg">
        🚫 No listings available.
      </div>
    );
  }

  const filtered = listings.filter(
    (item) => item.category === selectedListing
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600 text-lg">
        No listings found in{" "}
        <span className="font-semibold text-gray-800">{selectedListing}</span>.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10">
      {/* Page Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 text-center"
      >
        {selectedListing} Listings 🏡
      </motion.h2>

      {/* Responsive Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item._id}
            onClick={() => (
              dispatch(setClickedCard(item)), navigate("/view-card")
            )}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.04 }}
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-56 sm:h-60 overflow-hidden">
              <img
                src={item.image1?.url}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              {item.isBooked && (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full shadow-md animate-pulse">
                  🔒 Booked
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                {item.title}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base line-clamp-2">
                {item.description}
              </p>

              {/* Location + Category */}
              <div className="flex items-center justify-between mt-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <GoLocation className="text-red-500" />
                  <span className="truncate">{item.city}</span>
                </div>
                <span className="px-3 py-1 text-xs bg-gradient-to-r from-pink-100 to-pink-200 text-gray-800 rounded-full font-medium">
                  {item.category}
                </span>
              </div>

              {/* Rent */}
              <div className="mt-4 text-lg sm:text-xl font-bold text-gray-900">
                ₹{item.rent}{" "}
                <span className="text-sm font-medium text-gray-500">
                  / night
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FillterListed;
