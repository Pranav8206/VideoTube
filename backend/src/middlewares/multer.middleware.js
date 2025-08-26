import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp", "video/mp4", "video/mkv", "video/quicktime", "video/webm"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, .webp, .mp4, .mkv, .quicktime, .webm formats are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter
});
