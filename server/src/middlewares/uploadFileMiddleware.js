const multer = require("multer");
const {
  UPLOAD_USER_IMAGE_DIR,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_PRODUCT_IMAGE_DIR,
} = require("../config");

const userStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const userFileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype))
    return cb(new Error(`Allowed extensions are ${ALLOWED_FILE_TYPES}`));
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: userFileFilter,
});

const productStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const productFileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype))
    return cb(new Error(`Allowed extensions are ${ALLOWED_FILE_TYPES}`));
  cb(null, true);
};

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: productFileFilter,
});

module.exports = { uploadUserImage, uploadProductImage };
