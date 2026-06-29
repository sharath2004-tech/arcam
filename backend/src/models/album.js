const { connectToDatabase } = require('../db')

async function getAlbumsCollection() {
  const db = await connectToDatabase()
  return db.collection('albums')
}

/**
 * Create a new album
 * @param {Object} data - { title, description, ownerId, ownerRole, coverUrl, isPublic }
 */
async function createAlbum(data) {
  const col = await getAlbumsCollection()
  const now = new Date()
  const album = {
    title: data.title,
    description: data.description || '',
    ownerId: data.ownerId,         // photographer/studio_manager user id
    ownerRole: data.ownerRole,     // 'photographer' | 'studio_manager'
    coverUrl: data.coverUrl || null,
    photos: [],                    // array of { url, caption, uploadedAt }
    customerIds: [],               // user ids who can view this album
    isPublic: data.isPublic ?? false,
    qrCode: null,                  // filled when QR is generated
    totalViews: 0,
    createdAt: now,
    updatedAt: now,
  }
  const result = await col.insertOne(album)
  return { ...album, _id: result.insertedId }
}

/**
 * Get albums owned by a user
 */
async function getAlbumsByOwner(ownerId) {
  const col = await getAlbumsCollection()
  return col.find({ ownerId }).sort({ createdAt: -1 }).toArray()
}

/**
 * Get albums a customer has access to
 */
async function getAlbumsForCustomer(customerId) {
  const col = await getAlbumsCollection()
  return col.find({
    $or: [{ customerIds: customerId }, { isPublic: true }]
  }).sort({ createdAt: -1 }).toArray()
}

/**
 * Get a single album by id
 */
async function getAlbumById(albumId) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  return col.findOne({ _id: new ObjectId(albumId) })
}

/**
 * Update album metadata
 */
async function updateAlbum(albumId, updates) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  const allowed = ['title', 'description', 'coverUrl', 'isPublic', 'customerIds']
  const set = {}
  for (const key of allowed) {
    if (updates[key] !== undefined) set[key] = updates[key]
  }
  set.updatedAt = new Date()
  await col.updateOne({ _id: new ObjectId(albumId) }, { $set: set })
  return getAlbumById(albumId)
}

/**
 * Add a photo to an album
 */
async function addPhotoToAlbum(albumId, photo) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  const photoDoc = {
    url: photo.url,
    caption: photo.caption || '',
    videoUrl: photo.videoUrl || null,
    uploadedAt: new Date(),
  }
  await col.updateOne(
    { _id: new ObjectId(albumId) },
    { $push: { photos: photoDoc }, $set: { updatedAt: new Date() } }
  )
  return photoDoc
}

/**
 * Add multiple photos to an album in a single write
 * @param {string} albumId
 * @param {Array<{url, caption, videoUrl}>} photos
 */
async function addPhotosToAlbum(albumId, photos) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  const now = new Date()
  const photoDocs = photos.map(p => ({
    url: p.url,
    caption: p.caption || '',
    videoUrl: p.videoUrl || null,
    uploadedAt: now,
  }))
  await col.updateOne(
    { _id: new ObjectId(albumId) },
    { $push: { photos: { $each: photoDocs } }, $set: { updatedAt: now } }
  )
  return photoDocs
}

/**
 * Delete a photo from an album by url
 */
async function removePhotoFromAlbum(albumId, photoUrl) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  await col.updateOne(
    { _id: new ObjectId(albumId) },
    { $pull: { photos: { url: photoUrl } }, $set: { updatedAt: new Date() } }
  )
}

/**
 * Soft delete an album (mark inactive)
 */
async function deleteAlbum(albumId) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  await col.updateOne({ _id: new ObjectId(albumId) }, { $set: { deleted: true, updatedAt: new Date() } })
}

/**
 * Increment view count
 */
async function incrementViews(albumId) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  await col.updateOne({ _id: new ObjectId(albumId) }, { $inc: { totalViews: 1 } })
}

/**
 * Set QR code data on album
 */
async function setAlbumQRCode(albumId, qrData) {
  const { ObjectId } = require('mongodb')
  const col = await getAlbumsCollection()
  await col.updateOne({ _id: new ObjectId(albumId) }, { $set: { qrCode: qrData, updatedAt: new Date() } })
}

function sanitizeAlbum(album) {
  if (!album) return null
  return {
    id: album._id.toString(),
    title: album.title,
    description: album.description,
    ownerId: album.ownerId,
    ownerRole: album.ownerRole,
    coverUrl: album.coverUrl,
    photos: album.photos || [],
    customerIds: album.customerIds || [],
    isPublic: album.isPublic,
    qrCode: album.qrCode,
    totalViews: album.totalViews || 0,
    photoCount: (album.photos || []).length,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
  }
}

module.exports = {
  createAlbum,
  getAlbumsByOwner,
  getAlbumsForCustomer,
  getAlbumById,
  updateAlbum,
  addPhotoToAlbum,
  addPhotosToAlbum,
  removePhotoFromAlbum,
  deleteAlbum,
  incrementViews,
  setAlbumQRCode,
  sanitizeAlbum,
}
