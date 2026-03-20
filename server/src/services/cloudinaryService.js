import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const uploadBufferToCloudinary = async (fileBuffer, folder, options = {}) => {
  if (!fileBuffer) return null;

  if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_API_KEY || !ENV.CLOUDINARY_API_SECRET) {
    return null;
  }

  const uploadOptions = {
    folder,
    resource_type: 'auto',
    ...options,
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('[Cloudinary] Upload failed:', error.message || error);
        return reject(error);
      }

      resolve(result.secure_url || result.url);
    });
    uploadStream.end(fileBuffer);
  });
};
