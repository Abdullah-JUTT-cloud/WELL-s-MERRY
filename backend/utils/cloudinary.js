import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Product images (admin uploads)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wellsmerry/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
  },
});

export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Review images (customer uploads) — smaller size, separate folder
const reviewStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wellsmerry/reviews",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

export const uploadReviewImages = multer({
  storage: reviewStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB per file
});

// Payment receipt uploads (customer uploads proof of online payment)
const receiptStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wellsmerry/receipts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1000, height: 1400, crop: "limit", quality: "auto" }],
  },
});

export const uploadReceipt = multer({
  storage: receiptStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default cloudinary;
