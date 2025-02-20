const pool = require('../db');

// Get all team members with role and expertise names
const getAllTeamMembers = async (projectId, res) => {
    try {
        const result = await pool.query(`
            SELECT tm.*, r.roleName, ex.expertiseName
            FROM TeamMembers tm
            JOIN Role r ON tm.roleID = r.roleID
            JOIN Expertise ex ON tm.expertiseID = ex.expertiseID
            WHERE tm.projectID = $1
        `, [projectId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a specific team member by ID
const getTeamMember = async (projectId, req, res) => {
    const { memberID } = req.params;
    try {
        const result = await pool.query(`
            SELECT tm.*, r.roleName, ex.expertiseName
            FROM TeamMembers tm
            JOIN Role r ON tm.roleID = r.roleID
            JOIN Expertise ex ON tm.expertiseID = ex.expertiseID
            WHERE tm.projectID = $1 AND tm.memberID = $2
        `, [projectId, memberID]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team member not found.' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new team member
const createTeamMember = async (projectId, req, res) => {
    const { memberid, name, roleid, expertiseid, contactInfo } = req.body;
    if (!roleid || !expertiseid) {
        return res.status(400).json({ error: 'Role ID and Expertise ID are required.' });
    }

    try {
        const query = `
            INSERT INTO TeamMembers (memberID, projectID, name, roleID, expertiseID, contactInfo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [memberid, projectId, name, roleid, expertiseid, contactInfo];
        console.log(values)
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

// Update a team member's information
const updateTeamMember = async (projectId, req, res) => {
    const { memberID } = req.params;
    const { name, roleid, expertiseid, contactinfo, membertype } = req.body;

    if (!name && !roleid && !expertiseid && !contactinfo) {
        return res.status(400).json({ error: 'At least one field (name, role, expertise, contactInfo) is required to update.' });
    }

    try {
        const updates = [];
        const values = [];

        if (name) {
            updates.push(`name = $${updates.length + 1}`);
            values.push(name);
        }
        if (roleid) {
            updates.push(`roleID = $${updates.length + 1}`);
            values.push(roleid);
        }
        if (expertiseid) {
            updates.push(`expertiseID = $${updates.length + 1}`);
            values.push(expertiseid);
        }
        if (contactInfo) {
            updates.push(`contactInfo = $${updates.length + 1}`);
            values.push(contactInfo);
        }

        values.push(memberID, projectId);

        const query = `
            UPDATE TeamMembers
            SET ${updates.join(', ')}
            WHERE memberID = $${values.length - 1} AND projectID = $${values.length}
            RETURNING *;
        `;

        switch (memberType.toLowerCase()) {
            case "student":
                await db.query(
                    "UPDATE Student SET name = ?, contactinfo = ? WHERE studentid = ?",
                    [name, contactInfo, memberID]
                );
                break;
            case "expert":
                await db.query(
                    "UPDATE Expert SET name = ?, contactinfo = ? WHERE expertid = ?",
                    [name, contactInfo, memberID]
                );
                break;
            case "faculty":
                await db.query(
                    "UPDATE Faculty SET name = ?, contactinfo = ? WHERE facultyid = ?",
                    [name, contactInfo, memberID]
                );
                break;
            default:
                return res.status(400).send("Invalid member type");
        }

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

// Delete a team member
const deleteTeamMember = async (projectId, req, res) => {
    const { memberID } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM TeamMembers WHERE memberID = $1 AND projectID = $2 RETURNING *',
            [memberID, projectId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team member not found.' });
        }

        res.json({ message: 'Team member deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAllAvailableMembers = async (req, res) => {
    try {
        const students = await pool.query(`SELECT * FROM Student`);
        const experts = await pool.query(`SELECT * FROM Expert`);
        const faculty = await pool.query(`SELECT * FROM Faculty`);

        res.json({
            students: students.rows,
            experts: experts.rows,
            faculty: faculty.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};


module.exports = {
    getAllTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getAllAvailableMembers
};
