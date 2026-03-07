const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getCategories
} = require('../controllers/destinationController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/aws');

router.get('/', getDestinations);
router.get('/categories/list', getCategories);
router.get('/:id', getDestination);
router.post('/', protect, authorize('admin'), upload.array('images', 5), createDestination);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateDestination);
router.delete('/:id', protect, authorize('admin'), deleteDestination);

module.exports = router;
