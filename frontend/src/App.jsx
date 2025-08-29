import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Nav from "./Component/Nav";
import { useGetCurrentUser } from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import AddListing from "./pages/AddListing";
import MyListings from "./pages/MyListings";
import FillterListed from "./pages/FillterListed";
import ViewCard from "./pages/ViewCard";
import MyBooking from "./pages/MyBooking";
import CustomerBookedListings from "./pages/CustomerBookedListings";
import Rating from "./pages/Rating";

function App() {
  const { isLogging } = useSelector((state) => state.user);
  useGetCurrentUser(isLogging);

  return (
    <>
      <BrowserRouter>
        <ToastContainer 
        />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/filter-listings" element={<FillterListed />} />
          <Route path="/view-card" element={<ViewCard />} />
          <Route path="/my-booked-listings" element={<MyBooking />} />
          <Route path="/customer-booked-listings" element={<CustomerBookedListings />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
