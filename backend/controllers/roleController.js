const pool = require('../db'); // Adjust the path as necessary

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Role');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Create a new role
const createRole = async (req, res) => {
    const { rolename } = req.body;
    try {
        const query = `
            INSERT INTO Role (roleName)
            VALUES ($1)
            RETURNING *;
        `;
        const values = [rolename];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get a single role by ID
const getRole = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Role WHERE roleID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a role by ID
const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Role WHERE roleID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found.' });
        }
        res.json({ message: 'Role deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a role
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { roleName } = req.body;

    if (!roleName) {
        return res.status(400).json({ error: 'Role name is required to update.' });
    }

    try {
        const query = `
            UPDATE Role
            SET roleName = $1
            WHERE roleID = $2
            RETURNING *;
        `;
        const values = [roleName, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Role not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllRoles,
    createRole,
    getRole,
    deleteRole,
    updateRole
};
