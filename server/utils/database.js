import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_CONNECT = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected...");
  } catch (err) {
    console.log(err);
  }
};

export default DB_CONNECT;
