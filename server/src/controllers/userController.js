const User = require('../models/User');
const Order = require('../models/Order');

const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        staffType: updatedUser.staffType,
        permissions: updatedUser.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getMyOrders,
};