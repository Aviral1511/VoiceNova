import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import main from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", async (req, res) => {
    let prompt = req.query.prompt || "Explain how AI works in a few words";
    let data = await main(prompt);
    res.json({ data });
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Listening on PORT ${PORT}`);
})