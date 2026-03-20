import multer from 'multer';

const allowedFormats = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'video/mp4',
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!allowedFormats.includes(file.mimetype)) {
    const err = new Error('Invalid file type. Allowed: JPG, PNG, WEBP, HEIC, MP4.');
    err.statusCode = 400;
    return cb(err);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
export default upload;
