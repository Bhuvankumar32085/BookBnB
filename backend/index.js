import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import listingRoute from "./routes/listing.route.js";
import BookingRoute from "./routes/booking.route.js";
import { ConnectDB } from "./configs/DB.js";
import path from "path";//
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: "https://bookbnb-sijf.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const __dirname=path.resolve();//

// routes
app.use("/api/user", userRoute);
app.use("/api/listing", listingRoute);
app.use("/api/booking", BookingRoute);


app.use(express.static(path.join(__dirname,'frontend/dist')))//
app.get(/.*/,(req,res)=>{
  res.sendFile(path.resolve(__dirname,'frontend','dist','index.html'))
})//

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
