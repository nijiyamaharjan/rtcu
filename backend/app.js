const express = require('express');

const projectRoutes = require('./routes/projectRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const expertRoutes = require('./routes/expertRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const teamMembersRoutes = require('./routes/teamMembersRoutes');

const app = express();
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json())

app.use('/project', projectRoutes);
app.use('/training', trainingRoutes);
app.use('/organization', organizationRoutes);
app.use('/expert', expertRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
