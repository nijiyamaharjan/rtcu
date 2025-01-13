const pool = require('../db'); // Adjust the path as necessary

const getAllOrganizations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Organization');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const createOrganization = async (req, res) => {
    const { organizationID, name, contactInfo } = req.body;
    try {
        const query = `
            INSERT INTO Organization (organizationID, name, contactInfo)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [organizationID, name, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const getOrganization = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Organization WHERE organizationID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteOrganization = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Organization WHERE organizationID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found.' });
        }
        res.json({ message: 'Organization deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateOrganization = async (req, res) => {
    const { id } = req.params; 
    const { name, contactInfo } = req.body; 

    if (!name && !contactInfo) {
        return res.status(400).json({ error: 'At least one field (name, contactInfo) is required to update.' });
    }

    try {
        // Dynamic query construction for updating only provided fields
        const updates = [];
        const values = [];

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
            UPDATE Organization
            SET ${updates.join(', ')}
            WHERE organizationID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllOrganizations,
    createOrganization,
    getOrganization,
    deleteOrganization,
    updateOrganization
};