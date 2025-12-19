import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    connectDB();
    console.log(`Listening on PORT ${PORT}`);
})