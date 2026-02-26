const Assignment = require('../models/Assignment');

exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find().select('title description difficulty');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching assignments' });
    }
};

exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching assignment' });
    }
};
