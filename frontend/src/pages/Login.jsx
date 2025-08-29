import { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaAirbnb } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsLogging } from "../redux/slices/userslice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/user/login", input);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setIsLogging(true));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-red-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-[90%] sm:w-[400px] flex flex-col"
      >
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <FaAirbnb className="text-red-500 text-4xl" />
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
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
              Continue
            </button>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
