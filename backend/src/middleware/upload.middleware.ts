import fs from 'fs';
import path from 'path';
import multer from 'multer';

const uploadDir =
  process.env.UPLOAD_PATH ||
  path.join(__dirname, '..', '..', 'uploads', 'products');

fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    cb(null, `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'));
};

export const productImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export const getProductUploadDir = () => uploadDir;
