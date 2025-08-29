import React, { useState } from "react";
import instance from "../utils/axios";
import { toast } from "react-toastify";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { use } from "react";
import { useNavigate } from "react-router-dom";

const AddListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    city: "",
    landMark: "",
    category: "",
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [preview, setPreview] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File change handler with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImages({ ...images, [e.target.name]: file });
    setPreview({ ...preview, [e.target.name]: URL.createObjectURL(file) });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      for (let key in images) {
        data.append(key, images[key]);
      }

      const res = await instance.post("/listing/add", data);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }

      setFormData({
        title: "",
        description: "",
        rent: "",
        city: "",
        landMark: "",
        category: "",
      });
      setImages({ image1: null, image2: null, image3: null });
      setPreview({ image1: null, image2: null, image3: null });
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      toast.error("Error adding listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-10">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-3xl space-y-5 border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
          🏡 Add New Listing
        </h2>

        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter property title"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property"
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Rent & City */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Rent (₹)</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              placeholder="Enter rent"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Landmark & Category */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Landmark</label>
            <input
              type="text"
              name="landMark"
              value={formData.landMark}
              onChange={handleChange}
              placeholder="Enter landmark"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="Trending">Trending</option>
              <option value="Villas">Villas</option>
              <option value="Farm House">Farm House</option>
              <option value="Pool House">Pool House</option>
              <option value="Rooms">Rooms</option>
              <option value="Flat">Flat</option>
              <option value="Pg">PG</option>
              <option value="Cabins">Cabins</option>
              <option value="Shops">Shops</option>
            </select>
          </div>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["image1", "image2", "image3"].map((img, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                {preview[img] ? (
                  <img
                    src={preview[img]}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md mb-2"
                  />
                ) : (
                  <span className="text-gray-400">+ Upload</span>
                )}
                <input
                  type="file"
                  name={img}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id={img}
                  required
                />
                <label
                  htmlFor={img}
                  className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "🚀 Add Listing"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddListing;
