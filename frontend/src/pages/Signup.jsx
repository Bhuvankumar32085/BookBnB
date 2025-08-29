import { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaAirbnb } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/user/signup", input);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-red-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-[90%] sm:w-[400px] flex flex-col"
      >
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <FaAirbnb className="text-red-500 text-4xl" />
          <h1 className="text-3xl font-bold text-gray-800">Sign up</h1>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={input.name}
            onChange={changeHandler}
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={input.email}
            onChange={changeHandler}
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={changeHandler}
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />

          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold p-3 rounded-xl hover:bg-red-600 transition"
            >
              Create Account
            </button>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
