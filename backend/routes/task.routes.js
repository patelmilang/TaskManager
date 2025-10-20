
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const router = require("express").Router();

// multer setup for handling multipart/form-data (file upload)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/", getTasks);
// apply multer middleware to parse multipart/form-data and populate req.body and req.file
router.post("/", upload.single('pdf'), createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;