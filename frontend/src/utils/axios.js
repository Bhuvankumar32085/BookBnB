import axios from "axios";

const instance = axios.create({
  baseURL: "https://bookbnb-sijf.onrender.com/api",
  withCredentials: true,
});

export default instance;
