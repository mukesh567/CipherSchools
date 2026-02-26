const express = require('express');
const router = express.Router();
const { executeQuery, getHint, getTableSchema } = require('../controllers/queryController');

router.post('/execute', executeQuery);
router.post('/hint', getHint);
router.get('/schema/:tableName', getTableSchema);

module.exports = router;
