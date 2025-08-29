import { useEffect } from "react";
import { useDispatch } from "react-redux";
import instance from "../utils/axios";
import { setIsLogging, setLoggedUser } from "../redux/slices/userslice";

export const useGetCurrentUser = (isLogging) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLogging) return;
    const fetchUser = async () => {
      try {
        const res = await instance.get("/user/logged-user");
        if (res.data.success) {
          dispatch(setLoggedUser(res.data.user));
          dispatch(setIsLogging(true));
        }
      } catch (error) {
        console.log(error);
        dispatch(setLoggedUser(null));
        dispatch(setIsLogging(false));
      }
    };

    fetchUser();
  }, [dispatch, isLogging]);
};
