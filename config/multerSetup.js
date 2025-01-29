
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); 
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); 
    cb(null, file.fieldname + "-" + Date.now() + fileExtension); 
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif","image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("Only images are allowed!"), false); 
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

// Create an upload middleware for single file upload (profile_photo)
export const uploadProfilePhoto = upload.single("profile_photo"); // "profile_photo" is the field name in the form

