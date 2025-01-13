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

module.exports = {
    getAllTrainings,
    createTraining,
    getTraining,
    deleteTraining,
    updateTraining
};