const express = require('express');
const path = require('path');
const Router = express.Router;
const router = Router();
module.exports = router;
const multer = require('multer');
const storage = multer.diskStorage({'destination': 'api/uploads/', 'filename': filename});
const upload = multer({"fileFilter": fileFilter, "storage": storage});
const photoPath = path.resolve(__dirname, "../../client/photo-viewer.html");


router.get('/photo-viewer', function(request, response){
    response.sendFile(photoPath);
})

router.post('/upload', upload.single('photo'), function(request, response){
    if(request.fileValidationError){
        return response.status(400).json({"error": request.fileValidationError});
    }
    return response.status(201).json({"success": true});
})

function filename(request, file, callback){
    callback(null, file.originalname);
}

function fileFilter(request, file, callback){
    if(file.mimetype !== 'image/png'){
        request.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    }else{
        callback(null, true);
    }
}