import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Rating = () => {
  const { clickedCard } = useSelector((state) => state.listing);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Submit Rating:", rating);
    setLoading(true);
    try {
      const res = await instance.post(`/listing/${clickedCard._id}/rate`, {
        rating,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/"); // Redirect to home or listings page
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to submit rating");
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  if (!clickedCard) {
    return <p className="text-center mt-10">No listing selected!</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Listing Detail Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <img
          src={clickedCard?.image1?.url}
          alt={clickedCard.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
        <h2 className="text-2xl font-bold">{clickedCard.title}</h2>
        <p className="text-gray-600">{clickedCard.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          <span>🏙 City: {clickedCard.city}</span> |{" "}
          <span>📍 Landmark: {clickedCard.landMark}</span> |{" "}
          <span>🏡 Category: {clickedCard.category}</span>
        </div>
        <div className="mt-2 font-semibold text-lg">
          Booking Confirmed for ₹{clickedCard.rent} / night
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Give Your Rating</h3>
        <div className="flex space-x-2 mb-4">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={currentRating}
                  className="hidden"
                  onClick={() => setRating(currentRating)}
                />
                <FaStar
                  size={30}
                  className="cursor-pointer transition"
                  color={
                    currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

export default Rating;
