import { upload } from '../utils/upload.js';

// Single file upload middleware for avatars
export const uploadAvatar = upload.single('avatar');

