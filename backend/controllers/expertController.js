const pool = require('../db'); // Adjust the path as necessary

// Get all experts with their roleName and expertiseName
const getAllExperts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, ex.expertiseName
            FROM Expert e
            JOIN Expertise ex ON e.expertiseID = ex.expertiseID
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
}

// Create a new expert
const createExpert = async (req, res) => {
    const { expertID, name, expertiseid, contactInfo } = req.body;

    // Validate that and expertiseid are valid integers
    if ( !expertiseid) {
        return res.status(400).json({ error: 'Expertise ID required.' });
    }

    try {
        // Insert new expert using the and expertiseid provided
        const query = `
            INSERT INTO Expert (expertID, name, expertiseID, contactInfo)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [expertID, name, expertiseid, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get a specific expert by expertID
const getExpert = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT e.*, ex.expertiseName
            FROM Expert e
            JOIN Expertise ex ON e.expertiseID = ex.expertiseID
            WHERE expertID = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expert not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete an expert by expertID
const deleteExpert = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Expert WHERE expertID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expert not found.' });
        }
        res.json({ message: 'Expert deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update an expert's information
const updateExpert = async (req, res) => {
    const { id } = req.params;
    const { name, expertiseid, contactInfo } = req.body;


    if (!expertiseid && !name && !contactInfo) {
        return res.status(400).json({ error: 'At least one field (expertise, name, or contactInfo) is required to update.' });
    }

    try {
        // Collect the updates
        const updates = [];
        const values = [];
        if (expertiseid) {
            updates.push(`expertiseID = $${updates.length + 1}`);
            values.push(expertiseid);
        }

        if (name) {
            updates.push(`name = $${updates.length + 1}`);
            values.push(name);
        }

        if (contactInfo) {
            updates.push(`contactInfo = $${updates.length + 1}`);
            values.push(contactInfo);
        }

        values.push(id);

        const query = `
            UPDATE Expert
            SET ${updates.join(', ')}
            WHERE expertID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expert not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    getAllExperts,
    createExpert,
    getExpert,
    deleteExpert,
    updateExpert
};
