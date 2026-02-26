const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // For easier local development with external assets if any
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));

// Health check
app.get('/', (req, res) => res.send('CipherSQL API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
