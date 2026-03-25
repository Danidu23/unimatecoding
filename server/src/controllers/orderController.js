const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const {
  validateCashOrder,
  validateBankTransferOrder,
  canStudentCancel,
  isValidStatusTransition,
} = require('../utils/orderRules');

const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, pickupDate, slipUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    if (!pickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date is required',
      });
    }

    if (!['cash', 'bank_transfer'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    const parsedPickupDate = new Date(pickupDate);

    let ruleError = null;

    if (paymentMethod === 'cash') {
      ruleError = validateCashOrder(parsedPickupDate);
    } else if (paymentMethod === 'bank_transfer') {
      ruleError = validateBankTransferOrder(parsedPickupDate);

      if (!slipUrl) {
        return res.status(400).json({
          success: false,
          message: 'Payment slip is required for bank transfer preorder',
        });
      }
    }

    if (ruleError) {
      return res.status(400).json({
        success: false,
        message: ruleError,
      });
    }

    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    if (menuItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more menu items were not found',
      });
    }

    const unavailableItems = menuItems.filter((item) => !item.isAvailable);

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected menu items are unavailable',
      });
    }

    const orderItems = items.map((item) => {
      const menuItem = menuItems.find(
        (menu) => menu._id.toString() === item.menuItemId
      );

      const quantity = Number(item.quantity);

      return {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal: menuItem.price * quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const order = await Order.create({
      studentId: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'cash' ? 'pay_on_pickup' : 'payment_submitted',
      orderStatus: 'pending',
      orderDate: new Date(),
      pickupDate: parsedPickupDate,
      slipUrl: paymentMethod === 'bank_transfer' ? slipUrl : '',
    });

    return res.status(201).json({
      success: true,
      message:
        paymentMethod === 'cash'
          ? 'Order placed successfully'
          : 'Preorder placed successfully and waiting for payment verification',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating order',
    });
  }
};

const getMyOrdersFromOrdersRoute = async (req, res) => {
  try {
    const orders = await Order.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: 'My orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching my orders',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      'studentId',
      'name email phone role'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      req.user.role === 'student' &&
      order.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to access this order',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (req.user.role === 'student') {
      if (order.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to cancel this order',
        });
      }

      if (!canStudentCancel(order)) {
        return res.status(400).json({
          success: false,
          message: 'Student can cancel only pending orders',
        });
      }

      order.orderStatus = 'cancelled';
      order.cancelledBy = 'student';
      order.cancellationReason = 'Cancelled by student';
    }

    if (req.user.role === 'staff') {
      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation reason is required',
        });
      }

      order.orderStatus = 'cancelled';
      order.cancelledBy = 'staff';
      order.cancellationReason = reason;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, pickupDate } = req.query;

    const filter = {};

    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (pickupDate) {
      const start = new Date(pickupDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(pickupDate);
      end.setHours(23, 59, 59, 999);

      filter.pickupDate = { $gte: start, $lte: end };
    }

    const orders = await Order.find(filter)
      .populate('studentId', 'name email phone role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching all orders',
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: 'orderStatus is required',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (!isValidStatusTransition(order.orderStatus, orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status transition',
      });
    }

    if (
      order.paymentMethod === 'bank_transfer' &&
      order.paymentStatus !== 'payment_verified' &&
      orderStatus === 'confirmed'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Bank transfer order cannot be confirmed before payment verification',
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
    });
  }
};

module.exports = {
  createOrder,
  getMyOrdersFromOrdersRoute,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};