import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { getToken } from "../utils/tokenUtils.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const alreadyExist = await User.findOne({ email });
        if (alreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
            secure : false
        })

        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email doesn't exists" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Wrong Password" });
        }

        const token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
            secure : false
        })

        res.status(200).json({ message: "User logged in successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });   
    }
}