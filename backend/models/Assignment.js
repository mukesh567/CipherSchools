const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  question: { type: String, required: true },
  expectedQuery: { type: String, required: true },
  hintContext: { type: String }, // Context for LLM hints
  tables: [{ type: String }], // Names of tables used in this assignment
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
