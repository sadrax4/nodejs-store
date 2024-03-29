const path = require("path")
const multer = require("multer");
const createHttpError = require("http-errors");
const fs = require("fs");

function createRoute(req) {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const day = date.getDate().toString();
    const directory = path.join(__dirname, "..", "..", "public", "uploads", "blogs", year, month, day);
    req.body.fileUploadPath = path.join("/", "uploads", "blogs", year, month, day);
    fs.mkdirSync(directory, { recursive: true });
    return directory;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = createRoute(req);
        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = String(new Date().getTime() + ext);
        req.body.filename = fileName;
        cb(null, fileName);
    }
})
function fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    const allowExt = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    if (allowExt.includes(ext)) {
        return cb(null, true);
    }
    return cb(createHttpError.BadRequest("فرمت تصویر اشتباه است"));
}
function videoFileFilter(req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    const allowExt = [".mp4", ".mp3", ".avi", ".mpg", ".mkv", ".mov"];
    if (allowExt.includes(ext)) {
        return cb(null, true);
    }
    return cb(createHttpError.BadRequest("فرمت ویدیو اشتباه است"));
}

const maxPictureSize = (parseInt(process.env.MAX_SIZE_OF_FILE) * 1000 * 1000);
const uploadFile = multer({ storage, fileFilter, limits: { fileSize: maxPictureSize } });

const maxVideoSize = (parseInt(process.env.MAX_SIZE_OF_VIDEO_FILE) * 1000 * 1000);
const uploadVideoFile = multer({ storage, videoFileFilter, limits: { fileSize: maxVideoSize } });

module.exports = {
    uploadFile,
    uploadVideoFile
};