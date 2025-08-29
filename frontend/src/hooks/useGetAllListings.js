import { useEffect } from "react";
import { useDispatch } from "react-redux";
import instance from "../utils/axios";
import { setListings } from "../redux/slices/listingSlice";

export const useGetAllListings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await instance.get("/listing/all");
        if (res.data.success) {
          dispatch(setListings(res.data.listings));
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchListings();
  }, [dispatch]);
};
