import User from '../models/User.js';
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        // Fetch user details from the database using userId
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}