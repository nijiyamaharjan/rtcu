const pool = require('../db'); // Adjust the path as necessary

// Get all faculty with their expertiseName
const getAllFaculty = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT f.*, ex.expertiseName
            FROM Faculty f
            JOIN Expertise ex ON f.expertiseid = ex.expertiseID
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Create a new faculty member
const createFaculty = async (req, res) => {
    const { facultyID, name, expertiseid, contactInfo } = req.body;

    // Validate that expertise are provided with correct IDs
    if (!expertiseid) {
        return res.status(400).json({ error: 'Expertise ID are required.' });
    }

    try {
        // Insert new faculty using the expertise IDs
        const query = `
            INSERT INTO Faculty (facultyID, name, expertiseid, contactInfo)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [facultyID, name, expertiseid, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get a specific faculty member by facultyID
const getFaculty = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT f.*, ex.expertiseName
            FROM Faculty f
            JOIN Expertise ex ON f.expertiseid = ex.expertiseID
            WHERE facultyID = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a faculty member by facultyID
const deleteFaculty = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Faculty WHERE facultyID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found.' });
        }
        res.json({ message: 'Faculty deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a faculty member's information
const updateFaculty = async (req, res) => {
    const { id } = req.params;
    const { name, expertiseid, contactInfo } = req.body;

    if (!expertiseid && !name && !contactInfo) {
        return res.status(400).json({ error: 'At least one field ( expertise, name, or contactInfo) is required to update.' });
    }

    try {
        // Collect the updates dynamically
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
            UPDATE Faculty
            SET ${updates.join(', ')}
            WHERE facultyID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllFaculty,
    createFaculty,
    getFaculty,
    deleteFaculty,
    updateFaculty
};
