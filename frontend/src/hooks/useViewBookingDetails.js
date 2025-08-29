import { useEffect } from "react";
import { useDispatch } from "react-redux";
import instance from "../utils/axios";
import { setBookingDetails } from "../redux/slices/listingSlice";

export const useViewBookingDetails = (isLogging,id,isBooked) => {
    // console.log('isBooked:', isBooked);
  const dispatch = useDispatch();

  useEffect(() => {
      if (!isLogging) return;
      if(!isBooked) {
        dispatch(setBookingDetails(null));
        return;
      };
    const fetchViewBookingDetails = async () => {
      try {
        const res = await instance.get(`/booking/details/${id}`);
        if (res.data.success) {
          dispatch(setBookingDetails(res.data.booking));
        }
      } catch (error) {
        console.log(error);
        dispatch(setBookingDetails(null));
      }
    };

    fetchViewBookingDetails();
  }, [dispatch, isLogging,id,isBooked]);
};
