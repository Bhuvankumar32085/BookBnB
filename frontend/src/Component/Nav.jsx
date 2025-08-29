import React, { useRef, useState } from "react";
import { GoSearch } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import instance from "../utils/axios";
import { setIsLogging, setLoggedUser } from "../redux/slices/userslice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setSelectedListing } from "../redux/slices/listingSlice";

/* ------------ Inline SVG Icons for Categories ------------- */
const CategoryIcon = ({ name, className = "w-6 h-6" }) => {
  const common = "stroke-current";
  switch (name) {
    case "Trending":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M13 3s1 3-2 6c-2 2-3 3-3 5a5 5 0 0 0 10 0c0-2-1-3-3-5 0 0 3-1 3-5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Villas":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M3 11l9-7 9 7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 11v9h14v-9"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 20v-5h6v5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Farm House":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M4 12l8-6 8 6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 12v8h12v-8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 20v-5h4v5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 17c2 0 3-2 5-2s3 2 5 2"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Pool House":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M4 10l8-6 8 6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 10v5" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M18 10v5" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M3 18c1.2 0 1.8-1 3-1s1.8 1 3 1 1.8-1 3-1 1.8 1 3 1 1.8-1 3-1"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Rooms":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path d="M3 20h18" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M5 20v-7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10V7a3 3 0 1 1 6 0v3"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Flat":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.8" />
          <path d="M4 10h16M10 4v16" strokeWidth="1.8" />
        </svg>
      );
    case "Pg":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <circle cx="8" cy="8" r="3" strokeWidth="1.8" />
          <path
            d="M2 20a6 6 0 0 1 12 0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect x="14" y="10" width="8" height="8" rx="1.5" strokeWidth="1.8" />
          <path d="M16 14h4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "Cabins":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M4 12l8-6 8 6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 12v8h12v-8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 20l2-3h6l2 3"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Shops":
      return (
        <svg
          viewBox="0 0 24 24"
          className={`${className} ${common}`}
          fill="none"
        >
          <path
            d="M4 8h16l-1 3a4 4 0 0 1-4 3H9a4 4 0 0 1-4-3L4 8z"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 14v6h12v-6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 8V5h6v3"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

/* --------------- Category List ---------------- */
const CATEGORIES = [
  "Trending",
  "Villas",
  "Farm House",
  "Pool House",
  "Rooms",
  "Flat",
  "Pg",
  "Cabins",
  "Shops",
];

const Nav = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { isLogging } = useSelector((state) => state.user);
  const rowRef = useRef(null);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const setActiveFun = (label) => {
    setActive(label);
    dispatch(setSelectedListing(label));
    navigation("/filter-listings");
  };

  const logoutHandler = async () => {
    try {
      const res = await instance.get("/user/logout");
      if (res.data.success) {
        dispatch(setIsLogging(false));
        dispatch(setLoggedUser(null));
        toast.success(res.data.message);
        navigation("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="w-full border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 md:py-4">
          {/* Logo */}
          <motion.img
            onClick={() => navigation("/")}
            src="/OIP.jpeg"
            alt="logo"
            className="w-9 h-9 md:w-10 md:h-10 object-cover rounded-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
          />

          {/* Search Pill (desktop) */}
          <div className="hidden md:flex items-center gap-2 border border-gray-300 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition cursor-pointer">
            <span className="text-sm font-medium px-2">Anywhere</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium px-2">Any week</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 px-2">Add guests</span>
            <GoSearch className="bg-red-500 text-white rounded-full p-2 w-8 h-8" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigation("/add-listing")}
              className="bg-red-400 text-white font-semibold px-4 py-2 text-sm rounded-full hover:bg-gray-100 transition"
            >
              List your home
            </button>

            {/* Profile menu */}
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 border rounded-full px-3 py-1.5 hover:shadow-md transition"
            >
              {/* <GiHamburgerMenu className="text-gray-700 w-5 h-5" /> */}
              <CgProfile className="text-gray-700 w-6 h-6" />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="absolute right-4 top-[64px] w-56 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="py-2">
                  {isLogging ? (
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer font-medium"
                    >
                      Log out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigation("/login")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer font-medium"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => navigation("/signup")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer"
                      >
                        signup
                      </button>
                    </>
                  )}
                </div>
                <hr />
                <div className="py-2">
                  <button
                    onClick={() =>
                      isLogging
                        ? navigation("/my-listings")
                        : (navigation("/login"),
                          toast.error("Please log in to view your listings"))
                    }
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer"
                  >
                    My Listing
                  </button>
                  <button
                  onClick={() =>
                    isLogging
                      ? navigation("/my-booked-listings")
                      : (navigation("/login"),
                        toast.error("Please log in to view your bookings"))
                  }
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer">
                    My Booking
                  </button>
                  <button
                  onClick={() =>
                    isLogging
                      ? navigation("/customer-booked-listings")
                      : (navigation("/login"),
                        toast.error("Please log in to view Customer bookings"))
                  }
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer">
                    Customer Booked
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:cursor-pointer">
                    Help Center
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="relative border-b border-gray-100 bg-white">
        {/* Gradient edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          ref={rowRef}
          className="no-scrollbar overflow-x-auto whitespace-nowrap px-4 md:px-6"
        >
          <div className="flex items-center gap-5 md:gap-7 py-3 md:py-4">
            {CATEGORIES.map((label) => {
              const isActive = active === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveFun(label)}
                  className={`flex flex-col items-center justify-center flex-shrink-0 
                    px-2 md:px-3 py-1 rounded-xl transition
                    ${
                      isActive ? "text-black" : "text-gray-600 hover:text-black"
                    }`}
                >
                  <div
                    className={`rounded-2xl p-2 md:p-2.5 border ${
                      isActive
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <CategoryIcon
                      name={label}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  </div>
                  <span className="text-[11px] md:text-xs mt-1">{label}</span>
                  {isActive && (
                    <span className="mt-1 h-0.5 w-6 bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* small helper: hide default scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Nav;
