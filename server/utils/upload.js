import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Get file URL
export const getFileUrl = (filename) => {
  if (!filename) return null;
  // Return relative path or full URL based on your setup
  return `/uploads/avatars/${filename}`;
};

// Delete file
export const deleteFile = (filename) => {
  if (!filename || typeof filename !== 'string') return;

  // Enforce simple filename only (no directory components)
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) return;

  // Allow only expected avatar filename format produced by multer storage
  if (!/^avatar-\d+-\d+\.[a-zA-Z0-9]+$/.test(safeFilename)) return;

  // Resolve and ensure the target stays within uploadsDir
  const filePath = path.resolve(uploadsDir, safeFilename);
  const rootPath = path.resolve(uploadsDir) + path.sep;
  if (!filePath.startsWith(rootPath)) return;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

