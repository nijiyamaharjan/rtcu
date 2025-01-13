const pool = require('../db'); // Adjust the path as necessary

const getAllExperts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Expert');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const createExpert = async (req, res) => {
    const { expertID, name, role, expertise, contactInfo } = req.body;
    try {
        const query = `
            INSERT INTO Expert (expertID, name, role, expertise, contactInfo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [expertID, name, role, expertise, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getExpert = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Expert WHERE expertID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expert not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

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

const updateExpert = async (req, res) => {
    const { id } = req.params; 
    const { name, role, expertise, contactInfo } = req.body; 

    if (!name && !role && !expertise && !contactInfo) {
        return res.status(400).json({ error: 'At least one field (name, role, expertise, contactInfo) is required to update.' });
    }

    try {
        // Dynamic query construction for updating only provided fields
        const updates = [];
        const values = [];

        if (name) {
            updates.push(`name = $${updates.length + 1}`);
            values.push(name);
        }
        if (role) {
            updates.push(`role = $${updates.length + 1}`);
            values.push(role);
        }
        if (expertise) {
            updates.push(`expertise = $${updates.length + 1}`);
            values.push(expertise);
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