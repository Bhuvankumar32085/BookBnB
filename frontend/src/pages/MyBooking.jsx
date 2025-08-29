import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setClickedCard } from "../redux/slices/listingSlice";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { GoLocation } from "react-icons/go";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";

const MyBooking = () => {
  const { isLogging } = useSelector((state) => state.user);
  useGetCurrentUser(isLogging);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedUser } = useSelector((state) => state.user);


  if (!loggedUser) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        🚪 Please login to see your Booking.
      </div>
    );
  }

  if (loggedUser?.bookings?.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        📭 No Booking found.
      </div>
    );
  }

  const myBookings = loggedUser?.bookings;

  if (myBookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        🏡 You haven’t posted any bookings yet.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 lg:px-20 py-10">
      {/* Page Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center"
      >
        ✨ My Bookings
      </motion.h2>

      {/* Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {myBookings.map((item, i) => (
          <motion.div
            key={item._id}
            onClick={() => (
              dispatch(setClickedCard(item)), navigate("/view-card")
            )}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full h-60">
              <img
                src={item.image1?.url}
                alt={item.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              {item.isBooked && (
                <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs rounded-full shadow-md animate-pulse">
                  🔒 Booked
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {item.title}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-2">
                {item.description}
              </p>

              {/* Location + Category */}
              <div className="flex items-center justify-between mt-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <GoLocation className="text-red-500" />
                  <span>{item.city}</span>
                </div>
                <span className="px-3 py-1 text-xs bg-gradient-to-r from-pink-100 to-pink-200 text-gray-800 rounded-full font-medium">
                  {item.category}
                </span>
              </div>

              {/* Rent */}
              <div className="mt-4 text-lg font-bold text-gray-900">
                ₹{item.rent}{" "}
                <span className="text-sm font-medium">/ night</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
