const express = require('express');
const { addPerson, seeAllPersons, reportFound } = require('./lostController');
const { upload, upload_image } = require('./upload'); // Correct import for upload and upload_image
const router = express.Router();

router.post('/addPerson', addPerson);
router.post('/upload', upload.single('image'), upload_image);
router.get('/seeAll', seeAllPersons);

// New route to report a found person
router.post('/reportFound', reportFound);

module.exports = router;

