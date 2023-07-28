const multer = require("multer");
const fs = require("fs");
const createHttpError = require("http-errors");
const path = require("path");

const createRoute = (req) => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString() + 1;
  const day = date.getDate().toString();
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "users",
    year,
    month,
    day
  );
  req.body.fileUploadPath = path.join("uploads", "users", year, month, day);
  fs.mkdirSync(directory, { recursive: true });
  return directory;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = createRoute(req);
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = String(new Date().getTime() + ext);
    req.body.filename = filename;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const validType = [".png", ".webp", ".jpg", ".jpeg"];

  if (validType.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("فرمت ارسال شده صحیح نمیباشد"));
};

const upload = multer({ storage, fileFilter });

module.exports = {
  upload,
};
