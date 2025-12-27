import uploadToCloudinary from '../configs/cloudinary.js';
import main from '../gemini.js';
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
        
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const askAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        const username = user.name;
        const assistantName = user.assistantName || "VoiceNova";
        const result = await main(command, assistantName, username);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            // If response contains JSON, parse and send it
            return res.status(200).json({ response: "Sorry I didn't get you" });
        }
        const jsonResponse = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ response: jsonResponse });

        // Optionally, you can save the interaction to user's history
        user.history.push(`User: ${command}\n${assistantName}: ${response}`);
        await user.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
}