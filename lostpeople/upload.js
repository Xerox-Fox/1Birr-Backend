const multer = require('multer');
const fs = require('fs');
const db = require("../db/dbConfig");

// Ensure the upload directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

async function upload_image(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Asynchronously read the file
    const imageFile = fs.readFileSync(req.file.path);
    const imageName = req.file.filename;

    const sql = 'INSERT INTO lost_people (image_name, image_data) VALUES (?, ?)';
    db.query(sql, [imageName, imageFile], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to upload image' });
      }
      res.status(200).json({ message: 'Image uploaded successfully', id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while uploading the image' });
  }
}

module.exports = { upload, upload_image };
