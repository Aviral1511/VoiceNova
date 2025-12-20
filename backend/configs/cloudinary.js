import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadToCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // Remove file from server after upload
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        fs.unlinkSync(filePath); // Remove file from server after upload
        throw error;
    }
}

export default uploadToCloudinary;
