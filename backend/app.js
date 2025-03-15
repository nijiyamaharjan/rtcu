const express = require('express');

const projectRoutes = require('./routes/projectRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const expertRoutes = require('./routes/expertRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const roleRoutes = require('./routes/roleRoutes');
const expertiseRoutes = require('./routes/expertiseRoutes');
const teamMembersRoutes = require('./routes/teamMembersRoutes');
const user = require('./routes/user')
const app = express();
const cors = require('cors')
const pool = require('./db');
const path = require('path');
app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/project', projectRoutes);
app.use('/role', roleRoutes);
app.use('/expertise', expertiseRoutes);
app.use('/training', trainingRoutes);
app.use('/organization', organizationRoutes);
app.use('/expert', expertRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/auth', user)

app.use('/get-all-team', async (req, res) => {
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
})

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
