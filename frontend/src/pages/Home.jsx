import React, { useEffect } from "react";
import { useGetAllListings } from "../hooks/useGetAllListings";
import { useDispatch, useSelector } from "react-redux";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { GoLocation } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import {
  setClickedCard,
  setSelectedListing,
} from "../redux/slices/listingSlice";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1 mt-1">
      {stars.map((star) => (
        <FaStar
          key={star}
          className={`${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {rating > 0 ? rating.toFixed(1) : "New"}
      </span>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedListing(null));
    dispatch(setClickedCard(null));
  }, [dispatch]);

  useGetAllListings();
  const { listings } = useSelector((state) => state.listing);
  const { loggedUser } = useSelector((state) => state.user);
 
  // console.log(listings);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 lg:px-20 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          Explore Unique Stays
        </h1>
        <p className="text-gray-600 mt-2 text-base md:text-lg">
          Book trending places and discover your next adventure 🌍
        </p>
      </motion.div>

      {/* Listings Grid */}
      <motion.div
        layout
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {listings &&
          listings.map((item, i) => (
            <motion.div
              key={item._id}
              onClick={() => (
                dispatch(setClickedCard(item)), navigate("/view-card")
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 relative cursor-pointer"
            >
              {/* Admin badge */}
              {loggedUser?._id === item?.host && (
                <span className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 text-xs rounded-full shadow z-10">
                  Admin
                </span>
              )}

              {/* Booked badge */}
              {item.isBooked && (
                <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs rounded-full shadow z-10">
                  Booked
                </span>
              )}

              {/* Image Section */}
              <div className="relative w-full h-56 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={item.image1?.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {item.description}
                </p>

                {/* Rating */}
                <StarRating rating={item.rating || 0} />

                {/* Location + Category */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <GoLocation className="text-red-500" />
                  <span>{item.city}</span>
                  <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Rent */}
                <div className="mt-3 font-bold text-gray-800">
                  ₹{item.rent} / night
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default Home;
