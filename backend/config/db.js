const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

// PostgreSQL Sandbox Connection
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    ssl: process.env.PGHOST !== 'localhost' ? { rejectUnauthorized: false } : false,
});

module.exports = { connectDB, pool };
