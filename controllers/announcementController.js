const Announcement = require('../models/announcementModel');
const logAction = require('../models/auditLogHelper'); // existing audit log helper (reused)

const CATEGORIES = ['General Announcement', 'Event', 'Reminder', 'Promotion', 'Important Notice'];

// Audit logging should never break the announcement action itself.
const audit = async (req, action, id, details) => {
  try {
    await logAction(req.user.user_id, action, 'announcements', id, details);
  } catch (e) { /* already logged to console by the helper */ }
};

// Accepts 'YYYY-MM-DDTHH:MM' or 'YYYY-MM-DD HH:MM[:SS]'. Returns MySQL DATETIME text,
// null when empty, or undefined when invalid.
const toSqlDate = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const m = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return undefined;
  const d = new Date(`${m[1]}T${m[2]}:${m[3]}:00`);
  if (isNaN(d.getTime())) return undefined;
  return `${m[1]} ${m[2]}:${m[3]}:${m[4] || '00'}`;
};

// Returns { error } or { data } (cleaned values)
const validate = (body) => {
  const title = (body.title || '').trim();
  const message = (body.message || '').trim();
  const category = body.category || 'General Announcement';

  if (!title) return { error: 'Title is required.' };
  if (title.length > 150) return { error: 'Title must be 150 characters or fewer.' };
  if (!message) return { error: 'Message is required.' };
  if (message.length > 2000) return { error: 'Message must be 2000 characters or fewer.' };
  if (!CATEGORIES.includes(category)) return { error: 'Invalid category.' };

  const published_at = toSqlDate(body.published_at);
  const expires_at = toSqlDate(body.expires_at);
  if (published_at === undefined) return { error: 'Invalid publish date.' };
  if (expires_at === undefined) return { error: 'Invalid expiration date.' };
  if (expires_at && published_at && expires_at <= published_at)
    return { error: 'Expiration date must be after the publish date.' };
  if (expires_at && !published_at && expires_at <= toSqlDate(new Date().toISOString().slice(0, 16)))
    return { error: 'Expiration date must be in the future.' };

  return {
    data: { title, message, category, published_at, expires_at, is_active: body.is_active !== false && body.is_active !== 0 }
  };
};

// Admin can touch any announcement; Staff only their own.
const canModify = (user, announcement) =>
  user.role_name === 'Admin' || announcement.created_by === user.user_id;

// GET /api/announcements  (any logged-in user)
exports.getActive = async (req, res) => {
  try {
    res.status(200).json(await Announcement.getActive());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/announcements/manage  (Admin = all, Staff = their own)
exports.getForManagement = async (req, res) => {
  try {
    const onlyMine = req.user.role_name !== 'Admin';
    res.status(200).json(await Announcement.getForManagement(onlyMine ? req.user.user_id : null));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/announcements
exports.create = async (req, res) => {
  try {
    const { error, data } = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    const id = await Announcement.create(data, req.user.user_id);
    await audit(req, 'CREATE', id, `Created announcement "${data.title}"`);
    res.status(201).json({ message: 'Announcement created successfully', announcement_id: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/announcements/:id
exports.update = async (req, res) => {
  try {
    const existing = await Announcement.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Announcement not found' });
    if (!canModify(req.user, existing))
      return res.status(403).json({ message: 'You can only edit your own announcements.' });

    const { error, data } = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    await Announcement.update(req.params.id, data);
    await audit(req, 'UPDATE', Number(req.params.id), `Updated announcement "${data.title}"`);
    res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/announcements/:id/archive
exports.archive = async (req, res) => {
  try {
    const existing = await Announcement.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Announcement not found' });
    if (!canModify(req.user, existing))
      return res.status(403).json({ message: 'You can only archive your own announcements.' });

    await Announcement.archive(req.params.id);
    await audit(req, 'ARCHIVE', Number(req.params.id), `Archived announcement "${existing.title}"`);
    res.status(200).json({ message: 'Announcement archived successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/announcements/:id  (Admin only - permanent)
exports.remove = async (req, res) => {
  try {
    const existing = await Announcement.getById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Announcement not found' });

    await Announcement.remove(req.params.id);
    await audit(req, 'DELETE', Number(req.params.id), `Deleted announcement "${existing.title}"`);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
