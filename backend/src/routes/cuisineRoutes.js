const express = require('express');
const router = express.Router();
const {
  getCuisines,
  getCuisine,
  createCuisine,
  updateCuisine,
  deleteCuisine
} = require('../controllers/cuisineController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/aws');

router.get('/', getCuisines);
router.get('/:id', getCuisine);
router.post('/', protect, authorize('admin'), upload.array('images', 3), createCuisine);
router.put('/:id', protect, authorize('admin'), upload.array('images', 3), updateCuisine);
router.delete('/:id', protect, authorize('admin'), deleteCuisine);

module.exports = router;