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

module.exports = {
    getAllProjects,
    createProject,
    getProject,
    deleteProject,
    updateProject,
};
