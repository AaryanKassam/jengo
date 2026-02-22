import multer from 'multer';
import path from 'path';
import fs from 'fs';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function makeStorage(subdir) {
  const dir = path.join(process.cwd(), 'uploads', subdir);
  ensureDir(dir);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || '');
      const safeExt = ext && ext.length <= 10 ? ext : '';
      cb(null, `${req.user._id}-${Date.now()}${safeExt}`);
    }
  });
}

function videoOnly(_req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('video/')) return cb(null, true);
  cb(new Error('Only video files are allowed'));
}

function imageOnly(_req, file, cb) {
  if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Only image files are allowed'));
}

function resumeOnly(_req, file, cb) {
  const okTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]);
  if (okTypes.has(file.mimetype)) return cb(null, true);
  cb(new Error('Only PDF or Word documents are allowed'));
}

export const uploadPitchVideo = multer({
  storage: makeStorage('pitch-videos'),
  fileFilter: videoOnly,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export const uploadResume = multer({
  storage: makeStorage('resumes'),
  fileFilter: resumeOnly,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const uploadProfilePhoto = multer({
  storage: makeStorage('profile-photos'),
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

