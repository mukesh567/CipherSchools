const { pool } = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Assignment = require('../models/Assignment');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.executeQuery = async (req, res) => {
    const { query } = req.body;

    if (!query) return res.status(400).json({ error: 'Query is required' });

    // Basic sanitization/validation (preventing destructive operations in sandbox)
    const forbiddenKeywords = ['DROP', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE'];
    const upperQuery = query.toUpperCase();
    if (forbiddenKeywords.some(kw => upperQuery.includes(kw))) {
        return res.status(403).json({ error: 'Only SELECT queries are allowed in this sandbox.' });
    }

    try {
        const result = await pool.query(query);
        res.json({
            rows: result.rows,
            rowCount: result.rowCount,
            fields: result.fields.map(f => f.name)
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getHint = async (req, res) => {
    const { assignmentId, currentQuery } = req.body;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

        const prompt = `
      You are a SQL tutor. A student is trying to solve the following SQL assignment:
      
      Problem: ${assignment.question}
      Expected tables: ${assignment.tables.join(', ')}
      Expected logic involves: ${assignment.hintContext || 'Standard SQL queries'}

      The student's current (possibly incorrect or incomplete) query is:
      "${currentQuery || 'None'}"

      Please provide a helpful hint to guide them towards the correct solution. 
      CRITICAL: Do NOT provide the full SQL solution. Do NOT provide code blocks that can be copy-pasted. 
      Focus on explaining the concepts, the necessary joins, or the filtering conditions they might be missing.
      KEEP IT CONCISE.
    `;

        const modelNames = [
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-2.0-flash",
            "gemini-pro-latest"
        ];

        let lastError;
        let hintText;

        for (const modelName of modelNames) {
            try {
                console.log(`Attempting hint generation with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                hintText = response.text();
                if (hintText) break;
            } catch (err) {
                console.error(`Error with model ${modelName}:`, err.message);
                lastError = err;
                // Continue to next model on 404, 429, or other fetch errors
                continue;
            }
        }

        if (hintText) {
            res.json({ hint: hintText });
        } else {
            throw lastError || new Error("Failed to generate hint with any model");
        }
    } catch (err) {
        console.error('LLM Hint Error:', err);
        res.status(500).json({ error: 'Failed to generate hint' });
    }
};

exports.getTableSchema = async (req, res) => {
    const { tableName } = req.params;
    try {
        // Get column info
        const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [tableName]);

        // Get sample data (first 5 rows)
        const sampleData = await pool.query(`SELECT * FROM ${tableName} LIMIT 5`);

        res.json({
            tableName,
            columns: columns.rows,
            sampleData: sampleData.rows
        });
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch table info' });
    }
};
