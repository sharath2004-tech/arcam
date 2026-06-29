const router = require('express').Router()
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { requireAuth } = require('../middleware/auth')
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require('../config')

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

// Use memory storage — stream directly to Cloudinary, no disk writes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif',
                     'video/mp4', 'video/quicktime', 'video/webm', 'video/avi']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`))
    }
  },
})

/**
 * Upload a file buffer to Cloudinary as a stream.
 */
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
    stream.end(buffer)
  })
}

// POST /api/upload/image
// Accepts: multipart/form-data with field "file"
// Returns: { ok, url, publicId }
router.post('/image', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded' })

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `arcam/photos/${req.user.id}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 2048, height: 2048, crop: 'limit' },   // cap size
      ],
    })

    return res.json({ ok: true, url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('Image upload error:', err)
    return res.status(500).json({ ok: false, message: err.message || 'Image upload failed' })
  }
})

// POST /api/upload/video
// Accepts: multipart/form-data with field "file"
// Returns: { ok, url, publicId }
router.post('/video', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: 'No file uploaded' })

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: `arcam/videos/${req.user.id}`,
      resource_type: 'video',
    })

    return res.json({ ok: true, url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('Video upload error:', err)
    return res.status(500).json({ ok: false, message: err.message || 'Video upload failed' })
  }
})

module.exports = router
