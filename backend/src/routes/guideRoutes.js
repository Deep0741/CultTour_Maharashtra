const express = require('express');
const router = express.Router();
const {
  getGuides,
  getGuide,
  getMyProfile,
  updateMyProfile,
  uploadDocuments,
  getEarnings,
  approveGuide
} = require('../controllers/guideController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/aws');

router.get('/', getGuides);
router.get('/me', protect, authorize('guide'), getMyProfile);
router.put('/me', protect, authorize('guide'), updateMyProfile);
router.post('/documents', protect, authorize('guide'), upload.array('documents', 3), uploadDocuments);
router.get('/earnings', protect, authorize('guide'), getEarnings);
router.get('/:id', getGuide);
router.put('/:id/approve', protect, authorize('admin'), approveGuide);

module.exports = router;
