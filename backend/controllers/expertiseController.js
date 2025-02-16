const pool = require('../db'); // Adjust the path as necessary

// Get all expertise
const getAllExpertise = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Expertise');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Create a new expertise
const createExpertise = async (req, res) => {
    const { expertisename } = req.body;
    try {
        const query = `
            INSERT INTO Expertise (expertiseName)
            VALUES ($1)
            RETURNING *;
        `;
        const values = [expertisename];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get a single expertise by ID
const getExpertise = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Expertise WHERE expertiseID = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expertise not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete expertise by ID
const deleteExpertise = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Expertise WHERE expertiseID = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expertise not found.' });
        }
        res.json({ message: 'Expertise deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update expertise
const updateExpertise = async (req, res) => {
    const { id } = req.params;
    const { expertiseName } = req.body;

    if (!expertiseName) {
        return res.status(400).json({ error: 'Expertise name is required to update.' });
    }

    try {
        const query = `
            UPDATE Expertise
            SET expertiseName = $1
            WHERE expertiseID = $2
            RETURNING *;
        `;
        const values = [expertiseName, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Expertise not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAllExpertise,
    createExpertise,
    getExpertise,
    deleteExpertise,
    updateExpertise
};
