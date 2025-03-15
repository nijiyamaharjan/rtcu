const pool = require('../db'); // Adjust the path as necessary

const getAllProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Project');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createProject = async (req, res) => {
    const {
        projectID,
        title,
        description,
        type,
        startDate,
        endDate,
        status,
        budget,
        fundingOrgID,
        outsourcingOrgID,
    } = req.body;

    try {
        // Check if fundingOrgID exists in the Organization table
        const fundingOrgResult = await pool.query('SELECT * FROM Organization WHERE organizationID = $1', [fundingOrgID]);
        if (fundingOrgResult.rows.length === 0) {
            return res.status(400).json({ message: 'Funding Organization does not exist' });
        }

        // Check if outsourcingOrgID exists in the Organization table
        const outsourcingOrgResult = await pool.query('SELECT * FROM Organization WHERE organizationID = $1', [outsourcingOrgID]);
        if (outsourcingOrgResult.rows.length === 0) {
            return res.status(400).json({ message: 'Outsourcing Organization does not exist' });
        }

        // Proceed with inserting the project
        const query = `
            INSERT INTO Project (
                projectID, title, description, type, startDate, endDate, status, budget, fundingOrgID, outsourcingOrgID
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            )
            RETURNING *;
        `;

        const values = [
            projectID,
            title,
            description,
            type,
            startDate,
            endDate,
            status,
            budget,
            fundingOrgID,
            outsourcingOrgID
        ];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Project WHERE projectID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Project WHERE projectID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }
        res.json({ message: 'Project deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        type,
        startDate,
        endDate,
        status,
        budget,
        fundingOrgID,
        outsourcingOrgID,
    } = req.body;

    if (
        !title &&
        !description &&
        !type &&
        !startDate &&
        !endDate &&
        !status &&
        !budget &&
        !fundingOrgID &&
        !outsourcingOrgID
    ) {
        return res.status(400).json({ error: 'At least one field must be provided to update.' });
    }

    try {
        const updates = [];
        const values = [];

        if (title) {
            updates.push(`title = $${updates.length + 1}`);
            values.push(title);
        }
        if (description) {
            updates.push(`description = $${updates.length + 1}`);
            values.push(description);
        }
        if (type) {
            updates.push(`type = $${updates.length + 1}`);
            values.push(type);
        }
        if (startDate) {
            updates.push(`startDate = $${updates.length + 1}`);
            values.push(startDate);
        }
        if (endDate) {
            updates.push(`endDate = $${updates.length + 1}`);
            values.push(endDate);
        }
        if (status) {
            updates.push(`status = $${updates.length + 1}`);
            values.push(status);
        }
        if (budget) {
            updates.push(`budget = $${updates.length + 1}`);
            values.push(budget);
        }
        if (fundingOrgID) {
            updates.push(`fundingOrgID = $${updates.length + 1}`);
            values.push(fundingOrgID);
        }
        if (outsourcingOrgID) {
            updates.push(`outsourcingOrgID = $${updates.length + 1}`);
            values.push(outsourcingOrgID);
        }

        values.push(id);

        const query = `
            UPDATE Project
            SET ${updates.join(', ')}
            WHERE projectID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getProjectImages = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ProjectImage WHERE projectID = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getProjectAttachments = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ProjectAttachment WHERE projectID = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const addProjectImage = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verify project exists
        const projectCheck = await pool.query('SELECT * FROM Project WHERE projectID = $1', [id]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }
        
        // Handle uploaded file
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded.' });
        }
        
        // Generate a URL that points to the file on the server
        const imageURL = `/uploads/projects/${id}/${req.file.filename}`;
        
        // Create a new image record in the database
        const imageID = `img_${Date.now()}`;
        const caption = req.body.caption || '';
        const uploadDate = new Date().toISOString().split('T')[0];
        const displayOrder = parseInt(req.body.displayOrder || '0');
        
        const query = `
            INSERT INTO ProjectImage (imageID, projectID, imageURL, caption, uploadDate, displayOrder)
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

const addProjectAttachment = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verify project exists
        const projectCheck = await pool.query('SELECT * FROM Project WHERE projectID = $1', [id]);
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found.' });
        }
        
        // Handle uploaded file
        if (!req.file) {
            return res.status(400).json({ error: 'No attachment file uploaded.' });
        }
        
        // Generate a URL that points to the file on the server
        const fileURL = `/uploads/projects/${id}/${req.file.filename}`;
        
        // Create a new attachment record in the database
        const attachmentID = `att_${Date.now()}`;
        const fileName = req.file.originalname;
        const fileType = req.file.mimetype;
        const fileSize = req.file.size;
        const uploadDate = new Date().toISOString().split('T')[0];
        const description = req.body.description || '';
        
        const query = `
            INSERT INTO ProjectAttachment (attachmentID, projectID, fileName, fileURL, fileType, fileSize, uploadDate, description)
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

const deleteProjectImage = async (req, res) => {
    const { imageId } = req.params;
    try {
        const result = await pool.query('DELETE FROM ProjectImage WHERE imageID = $1 RETURNING *', [imageId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project image not found.' });
        }
        res.json({ message: 'Project image deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteProjectAttachment = async (req, res) => {
    const { attachmentId } = req.params;
    try {
        const result = await pool.query('DELETE FROM ProjectAttachment WHERE attachmentID = $1 RETURNING *', [attachmentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project attachment not found.' });
        }
        res.json({ message: 'Project attachment deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    getAllProjects,
    createProject,
    getProject,
    deleteProject,
    updateProject,
    getProjectImages,
    getProjectAttachments,
    addProjectImage,
    addProjectAttachment,
    deleteProjectImage,
    deleteProjectAttachment
};
