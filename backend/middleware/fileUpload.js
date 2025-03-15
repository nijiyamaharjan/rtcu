// Create a new file: middleware/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const projectUploadsDir = path.join(__dirname, '../uploads/projects');
const trainingUploadsDir = path.join(__dirname, '../uploads/trainings');

if (!fs.existsSync(projectUploadsDir)) {
    fs.mkdirSync(projectUploadsDir, { recursive: true });
}
if (!fs.existsSync(trainingUploadsDir)) {
    fs.mkdirSync(trainingUploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isProject = req.baseUrl.includes('project');
        const uploadDir = isProject ? projectUploadsDir : trainingUploadsDir;
        const entityId = req.params.id;
        const entityDir = path.join(uploadDir, entityId);
        
        if (!fs.existsSync(entityDir)) {
            fs.mkdirSync(entityDir, { recursive: true });
        }
        
        cb(null, entityDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        // If uploading image, accept image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for images!'), false);
        }
    } else if (file.fieldname === 'attachment') {
        // For attachments, allow pdf, doc, docx, xls, xlsx, etc.
        const allowedTypes = [
            'application/pdf', 
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for attachments!'), false);
        }
    } else {
        cb(null, true);
    }
};

// Configure multer
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

module.exports = upload;