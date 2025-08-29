import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listings: [],
    selectedListing: null,
    clickedCard: null,
    bookingDetails: null
  },
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setSelectedListing: (state, action) => {
      state.selectedListing = action.payload;
    },
    setClickedCard: (state, action) => {
      state.clickedCard = action.payload;
    },
    setBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
  },
});

export const { setListings, setSelectedListing, setClickedCard, setBookingDetails } =
  listingSlice.actions;
export default listingSlice.reducer;
