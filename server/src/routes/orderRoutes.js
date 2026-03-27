const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  createOrder,
  getPaymentReference,
  getMyOrdersFromOrdersRoute,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updatePaymentStatus,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');
const { requireStudent, requireStaff } = require('../middleware/roleMiddleware');
const { uploadSlip } = require('../middleware/uploadMiddleware');

const handleSlipUpload = (req, res, next) => {
  const uploader = uploadSlip.single('slip');

  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size must be less than 5 MB',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'File upload error',
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }

    next();
  });
};

router.get('/payment-reference', protect, requireStudent, getPaymentReference);
router.post('/', protect, requireStudent, handleSlipUpload, createOrder);
router.get('/my', protect, requireStudent, getMyOrdersFromOrdersRoute);
router.get('/', protect, requireStaff, getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);
router.patch('/:id/payment-status', protect, requireStaff, updatePaymentStatus);
router.patch('/:id/status', protect, requireStaff, updateOrderStatus);

module.exports = router;