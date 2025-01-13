const pool = require('../db'); 

const getAllTeamMembers = async (projectId, res) => {
    try {
        const result = await pool.query('SELECT * FROM TeamMembers WHERE projectID = $1', [projectId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getTeamMember = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM TeamMembers WHERE memberID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team member not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createTeamMember = async (req, res) => {
    const { memberID, projectID, name, role, expertise, contactInfo } = req.body;
    try {
        const query = `
            INSERT INTO TeamMembers (memberID, projectID, name, role, expertise, contactInfo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [memberID, projectID, name, role, expertise, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateTeamMember = async (req, res) => {
    const { id } = req.params;
    const { name, role, expertise, contactInfo } = req.body;
    
    if (!name && !role && !expertise && !contactInfo) {
        return res.status(400).json({ error: 'At least one field (name, role, expertise, contactInfo) is required to update.' });
    }

    try {
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
            UPDATE TeamMembers
            SET ${updates.join(', ')}
            WHERE memberID = $${values.length}
            RETURNING *;
        `;
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team member not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteTeamMember = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM TeamMembers WHERE memberID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team member not found.' });
        }
        res.json({ message: 'Team member deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
};
