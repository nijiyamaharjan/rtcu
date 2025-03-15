const pool = require('../db'); // Adjust the path as necessary

const getAllTrainings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Training');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const createTraining = async (req, res) => {
    const { trainingID, title, startDate, endDate } = req.body;
    try {
        const query = `
            INSERT INTO Training (trainingID, title, startDate, endDate)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [ trainingID, title, startDate, endDate];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getTraining = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Training WHERE trainingID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTraining = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Training WHERE trainingID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training not found.' });
        }
        res.json({ message: 'Training deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateTraining = async (req, res) => {
    const { id } = req.params; 
    const { trainingID, title, startDate, endDate } = req.body; 

    if (!title && !startDate && !endDate) {
        return res.status(400).json({ error: 'At least one field (title, startDate, endDate) is required to update.' });
    }

    try {
        // Dynamic query construction for updating only provided fields
        const updates = [];
        const values = [];

        if (title) {
            updates.push(`title = $${updates.length + 1}`);
            values.push(title);
        }
        if (startDate) {
            updates.push(`startDate = $${updates.length + 1}`);
            values.push(startDate);
        }
        if (endDate) {
            updates.push(`endDate = $${updates.length + 1}`);
            values.push(endDate);
        }

        values.push(id);

        const query = `
            UPDATE Training
            SET ${updates.join(', ')}
            WHERE trainingID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTrainingImages = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM TrainingImage WHERE trainingID = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTrainingAttachments = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM TrainingAttachment WHERE trainingID = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addTrainingImage = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verify training exists
        const trainingCheck = await pool.query('SELECT * FROM Training WHERE trainingID = $1', [id]);
        if (trainingCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Training not found.' });
        }
        
        // Handle uploaded file
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded.' });
        }
        
        // Generate a URL that points to the file on the server
        const imageURL = `/uploads/trainings/${id}/${req.file.filename}`;
        
        // Create a new image record in the database
        const imageID = `img_${Date.now()}`;
        const caption = req.body.caption || '';
        const uploadDate = new Date().toISOString().split('T')[0];
        const displayOrder = parseInt(req.body.displayOrder || '0');
        
        const query = `
            INSERT INTO TrainingImage (imageID, trainingID, imageURL, caption, uploadDate, displayOrder)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        
        const values = [imageID, id, imageURL, caption, uploadDate, displayOrder];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addTrainingAttachment = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verify training exists
        const trainingCheck = await pool.query('SELECT * FROM Training WHERE trainingID = $1', [id]);
        if (trainingCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Training not found.' });
        }
        
        // Handle uploaded file
        if (!req.file) {
            return res.status(400).json({ error: 'No attachment file uploaded.' });
        }
        
        // Generate a URL that points to the file on the server
        const fileURL = `/uploads/trainings/${id}/${req.file.filename}`;
        
        // Create a new attachment record in the database
        const attachmentID = `att_${Date.now()}`;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const fileSize = req.file.size;
        const uploadDate = new Date().toISOString().split('T')[0];
        const description = req.body.description || '';
        
        const query = `
            INSERT INTO TrainingAttachment (attachmentID, trainingID, fileName, fileURL, fileType, fileSize, uploadDate, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        
        const values = [attachmentID, id, fileName, fileURL, fileType, fileSize, uploadDate, description];
        const result = await pool.query(query, values);
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTrainingImage = async (req, res) => {
    const { imageId } = req.params;
    try {
        const result = await pool.query('DELETE FROM TrainingImage WHERE imageID = $1 RETURNING *', [imageId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training image not found.' });
        }
        res.json({ message: 'Training image deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTrainingAttachment = async (req, res) => {
    const { attachmentId } = req.params;
    try {
        const result = await pool.query('DELETE FROM TrainingAttachment WHERE attachmentID = $1 RETURNING *', [attachmentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Training attachment not found.' });
        }
        res.json({ message: 'Training attachment deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllTrainings,
    createTraining,
    getTraining,
    deleteTraining,
    updateTraining,
    getTrainingImages,
    getTrainingAttachments,
    addTrainingImage,
    addTrainingAttachment,
    deleteTrainingImage,
    deleteTrainingAttachment
};