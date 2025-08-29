import { useDispatch, useSelector } from "react-redux";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setClickedCard } from "../redux/slices/listingSlice";
import { useViewBookingDetails } from "../hooks/useViewBookingDetails";

const ViewCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const { loggedUser, isLogging } = useSelector((state) => state.user);
  const { clickedCard, bookingDetails } = useSelector((state) => state.listing);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useViewBookingDetails(isLogging, clickedCard._id, clickedCard.isBooked);
 

  const handleBooking = () => {
    if (!isLogging) {
      toast.error("Please login to book the listing");
      return navigate("/login");
    }
    setShowBookingForm(true);
  };

  // Calculate total when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      const diffDays = (eDate - sDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 0) {
        setTotalAmount(diffDays * clickedCard?.rent);
      } else {
        setTotalAmount(0);
      }
    }
  }, [startDate, endDate, clickedCard?.rent]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    try {
      setLoading(true);
      const res = await instance.post(`/booking/create/${clickedCard._id}`, {
        startDate,
        endDate,
        totalAmount,
      });

      if (res.data.success) {
        toast.success(res.data?.message);
        setShowBookingForm(false);
        navigate("/rating");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };
  //

  const isAdmin = loggedUser?._id === clickedCard?.host;


  if (!clickedCard) {
    return (
      <div className="text-center text-xl font-semibold mt-10">
        No Data Found
      </div>
    );
  }

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", e.target.title.value);
      data.append("description", e.target.description.value);
      data.append("rent", e.target.rent.value);
      data.append("city", e.target.city.value);
      data.append("landMark", e.target.landMark.value);

      if (e.target.image1.files[0])
        data.append("image1", e.target.image1.files[0]);
      if (e.target.image2.files[0])
        data.append("image2", e.target.image2.files[0]);
      if (e.target.image3.files[0])
        data.append("image3", e.target.image3.files[0]);


      const res = await instance.put(
        `/listing/update/${clickedCard._id}`,
        data
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setClickedCard(res.data.updatedData));
        // con
        navigate("/view-card");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBookingHandler = async () => {
    try {
      setLoading(true);
      const res = await instance.delete(`/booking/cancel/${clickedCard._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setClickedCard(res.data.listing));
        navigate("/view-card");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await instance.delete(`/listing/delete/${clickedCard._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`max-w-6xl mx-auto p-4 md:p-8 transition ${
          showEditForm ? "blur-md pointer-events-none select-none" : ""
        }`}
      >
        {/* Image Slider */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            className="h-[350px] md:h-[500px] w-full"
          >
            {[clickedCard.image1, clickedCard.image2, clickedCard.image3].map(
              (img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img?.url}
                    alt={`listing-img-${index}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 bg-white p-6 rounded-2xl shadow-xl space-y-6"
        >
          {/* Title + Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {clickedCard.title}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {!isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={clickedCard?.isBooked}
                  onClick={handleBooking}
                  className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow hover:shadow-md transition"
                >
                  {clickedCard?.isBooked ? "Already Booked" : "Book Now"}
                </motion.button>
              )}

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:shadow-md transition"
                >
                  Edit
                </motion.button>
              )}

              {isAdmin && clickedCard?.isBooked && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelBookingHandler}
                  className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-full shadow hover:shadow-md transition"
                >
                  Cancel Booking
                </motion.button>
              )}

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full shadow hover:shadow-md transition"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Delete"
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed">
            {clickedCard.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mt-2">
            <motion.span className="px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-full shadow-sm">
              ₹ {clickedCard.rent} / month
            </motion.span>

            <motion.span className="px-4 py-2 bg-green-100 text-green-600 font-semibold rounded-full shadow-sm">
              {clickedCard.category}
            </motion.span>

            <motion.span className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full shadow-sm">
              {clickedCard.city}
            </motion.span>

            <motion.span className="px-4 py-2 bg-purple-100 text-purple-600 font-semibold rounded-full shadow-sm">
              Landmark: {clickedCard.landMark}
            </motion.span>
          </div>
        </motion.div>

        {/* Booking Details Section */}
        {bookingDetails && isAdmin && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-xl space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 border-b pb-3">
              📌 Booking Details
            </h2>

            {/* Guest & Host Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  👤 Customer Info
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span>{" "}
                  {bookingDetails.guest?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {bookingDetails.guest?.email}
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  🏠 Host Info
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span>{" "}
                  {bookingDetails.host?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span>{" "}
                  {bookingDetails.host?.email}
                </p>
              </div>
            </div>

            {/* Booking Info */}
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                📅 Booking Info
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(bookingDetails.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(bookingDetails.endDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm capitalize bg-green-500`}
                  >
                    {bookingDetails.status}
                  </span>
                </p>
                <p className="text-lg font-semibold text-green-600">
                  💰 Total: ₹{bookingDetails.totalAmount}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Form Modal */}

      <AnimatePresence>
        {showEditForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay with blur */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEditForm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-white rounded-2xl p-6 w-[95%] max-w-2xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  ✏️ Edit Listing
                </h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  ✖
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={clickedCard.title}
                    placeholder="Title"
                    className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={clickedCard.description}
                    placeholder="Description"
                    rows={3}
                    className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  />
                </div>

                {/* Rent + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Rent (₹)
                    </label>
                    <input
                      type="number"
                      name="rent"
                      defaultValue={clickedCard.rent}
                      placeholder="Rent per month"
                      className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={clickedCard.city}
                      placeholder="City"
                      className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landMark"
                    defaultValue={clickedCard.landMark}
                    placeholder="Landmark"
                    className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  />
                </div>

                {/* Images */}
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image 1 */}
                  <div className="flex flex-col items-center">
                    {clickedCard.image1?.url && (
                      <img
                        src={clickedCard.image1.url}
                        alt="Preview 1"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <input
                      type="file"
                      name="image1"
                      accept="image/*"
                      className="w-full border px-4 py-3 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  </div>

                  {/* Image 2 */}
                  <div className="flex flex-col items-center">
                    {clickedCard.image2?.url && (
                      <img
                        src={clickedCard.image2.url}
                        alt="Preview 2"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <input
                      type="file"
                      name="image2"
                      accept="image/*"
                      className="w-full border px-4 py-3 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  </div>

                  {/* Image 3 */}
                  <div className="flex flex-col items-center">
                    {clickedCard.image3?.url && (
                      <img
                        src={clickedCard.image3.url}
                        alt="Preview 3"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <input
                      type="file"
                      name="image3"
                      accept="image/*"
                      className="w-full border px-4 py-3 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg transition"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowEditForm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-white rounded-2xl p-6 w-[95%] max-w-2xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📅 Booking Form
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Start Date */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    required
                  />
                </div>

                {/* Amount */}
                <div className="text-lg font-semibold text-gray-800">
                  Total Amount:{" "}
                  <span className="text-green-600">₹{totalAmount || 0}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 shadow-lg transition"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewCard;
