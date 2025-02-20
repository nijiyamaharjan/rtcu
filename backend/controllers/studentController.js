const pool = require("../db"); // Adjust the path as necessary

const getAllStudents = async (req, res) => {
    try {
        const result =
            await pool.query(`SELECT s.*, ex.expertiseName
            FROM Student s
            JOIN Expertise ex ON s.expertiseID = ex.expertiseID`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const createStudent = async (req, res) => {
    const { studentID, name, expertiseid, contactInfo } = req.body;

    if (!expertiseid) {
        return res.status(400).json({ error: 'Expertise ID is required.' });
    }
    try {
        const query = `
            INSERT INTO Student (studentID, name, expertiseID, contactInfo)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [studentID, name, expertiseid, contactInfo];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

};

const getStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT s.*, ex.expertiseName
            FROM Student s
            JOIN Expertise ex ON s.expertiseID = ex.expertiseID
            WHERE studentID = $1
            `
            ,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM Student WHERE studentID = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found." });
        }
        res.json({ message: "Student deleted successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, expertiseid, contactInfo } = req.body;

    if (!name && !expertiseid && !contactInfo) {
        return res
            .status(400)
            .json({
                error: "At least one field (name, expertiseid, contactInfo) is required to update.",
            });

    }

    try {
        // Dynamic query construction for updating only provided fields
        const updates = [];
        const values = [];

        if (name) {
            updates.push(`name = $${updates.length + 1}`);
            values.push(name);
        }
        if (expertiseid) {
            updates.push(`expertiseID = $${updates.length + 1}`);
            values.push(expertiseid);
        }
        if (contactInfo) {
            updates.push(`contactInfo = $${updates.length + 1}`);
            values.push(contactInfo);
        }

        values.push(id);

        const query = `
            UPDATE Student
            SET ${updates.join(", ")}
            WHERE studentID = $${values.length}
            RETURNING *;
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Student not found." });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllStudents,
    createStudent,
    getStudent,
    deleteStudent,
    updateStudent,
};
