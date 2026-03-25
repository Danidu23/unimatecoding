const Order = require('../models/Order');

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.paymentMethod !== 'bank_transfer') {
      return res.status(400).json({
        success: false,
        message: 'Only bank transfer orders can be payment-verified',
      });
    }

    if (order.paymentStatus !== 'payment_submitted') {
      return res.status(400).json({
        success: false,
        message: 'Only submitted payments can be verified',
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled order cannot be payment-verified',
      });
    }

    order.paymentStatus = 'payment_verified';
    order.orderStatus = 'confirmed';

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying payment',
    });
  }
};

const rejectPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.paymentMethod !== 'bank_transfer') {
      return res.status(400).json({
        success: false,
        message: 'Only bank transfer orders can be payment-rejected',
      });
    }

    if (order.paymentStatus !== 'payment_submitted') {
      return res.status(400).json({
        success: false,
        message: 'Only submitted payments can be rejected',
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    order.paymentStatus = 'payment_rejected';
    order.orderStatus = 'cancelled';
    order.cancelledBy = 'staff';
    order.cancellationReason = reason;

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment rejected and order cancelled successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while rejecting payment',
    });
  }
};

module.exports = {
  verifyPayment,
  rejectPayment,
};