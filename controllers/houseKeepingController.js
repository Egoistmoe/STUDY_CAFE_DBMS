const db = require('../config/database');

exports.getAll = async(req, res) => {
    const [rows] = await db.query('SELECT * FROM housekeeping_tasks');
    res.json(rows);
};

exports.create = async(req, res) => {
    const { area_id, description } = req.body;
    await db.query('INSERT INTO housekeeping_tasks (area_id, description) VALUES (?, ?)', [area_id, description]);
    res.json({ message: 'Task added' });
};

exports.update = async(req, res) => {
    const { description, status } = req.body;
    await db.query('UPDATE housekeeping_tasks SET description = ?, status = ? WHERE id = ?', [description, status, req.params.id]);
    res.json({ message: 'Task updated' });
};

exports.remove = async(req, res) => {
    await db.query('DELETE FROM housekeeping_tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Task deleted' });
};