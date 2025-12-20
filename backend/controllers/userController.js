import uploadToCloudinary from '../configs/cloudinary.js';
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

export const updateAssistant = async (req, res) => {
    try {
        const {assistantName, imageUrl} = req.body;
        let assistantImage;
        if(req.file){
            assistantImage = await uploadToCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName , assistantImage
        },{ new: true }).select('-password');
        console.log(user);
        
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}