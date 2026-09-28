import { v2 as cloudinary } from 'cloudinary';
import { Multer } from 'multer';
import multer from 'multer';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
// console.log("cloudinary config", cloudinary.config());

export const deleteCloudinaryImage = async (id: string) => {
  const assetToDelete = await cloudinary.uploader.destroy(id, {
    resource_type: 'image',
  });
  if (assetToDelete.result !== 'ok') {
    console.log('failed to delete image');
    throw new Error('Deletion failed: ' + assetToDelete.result);
  }
};

export const uploadImageToCloudinary = async (file: Express.Multer.File) => {
  try {
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const uploadedImage = await cloudinary.uploader.upload(base64Image, {
      folder: 'room_profile_images',
      resource_type: 'image',
    });
    return uploadedImage.secure_url;
  } catch (error) {
    console.error('failed to upload image to cloudinary :', error);
  }
};
export default cloudinary;
