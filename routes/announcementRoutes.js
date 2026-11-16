const express = require('express');
const router = express.Router();

const announcementController = require('../controllers/announcementController');
const { requireLogin, requireRole } = require('../middleware/authMiddleware');

// Every announcement route needs a valid login token.
router.use(requireLogin);

// VIEW (Admin, Staff, Student - any logged-in user)
router.get('/', announcementController.getActive);

// MANAGE (Admin and Staff only)
// NOTE: '/manage' must stay above '/:id' routes.
router.get('/manage', requireRole('Admin', 'Staff'), announcementController.getForManagement);
router.post('/', requireRole('Admin', 'Staff'), announcementController.create);
router.put('/:id', requireRole('Admin', 'Staff'), announcementController.update);
router.patch('/:id/archive', requireRole('Admin', 'Staff'), announcementController.archive);

// Permanent delete: Admin only
router.delete('/:id', requireRole('Admin'), announcementController.remove);

module.exports = router;
