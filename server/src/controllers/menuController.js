const { MenuItem, MENU_CATEGORIES } = require('../models/MenuItem');

const getMenuItems = async (req, res) => {
  try {
    const { category, available } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.isAvailable = available === 'true';
    }

    filter.canteen = 'main';

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Menu fetched successfully',
      data: menuItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching menu',
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, tags, isAvailable } = req.body;

    const errors = {};

    if (!name) errors.name = 'Item name is required';
    if (price === undefined || price === null || price === '') {
      errors.price = 'Price is required';
    }
    if (!category) errors.category = 'Category is required';

    if (category && !MENU_CATEGORIES.includes(category)) {
      errors.category = 'Invalid category';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const normalizedTags = Array.isArray(tags) ? tags : [];

    const menuItem = await MenuItem.create({
      name,
      description: description || '',
      price,
      category,
      tags: normalizedTags,
      isAvailable: typeof isAvailable === 'boolean' ? isAvailable : true,
      canteen: 'main',
    });

    return res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating menu item',
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, tags, isAvailable } = req.body;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    if (category !== undefined && !MENU_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    if (name !== undefined) menuItem.name = name;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined) menuItem.price = price;
    if (category !== undefined) menuItem.category = category;
    if (tags !== undefined) menuItem.tags = Array.isArray(tags) ? tags : [];
    if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

    const updatedMenuItem = await menuItem.save();

    return res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating menu item',
    });
  }
};

const updateMenuAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable must be true or false',
      });
    }

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    menuItem.isAvailable = isAvailable;

    const updatedMenuItem = await menuItem.save();

    return res.status(200).json({
      success: true,
      message: 'Menu item availability updated',
      data: updatedMenuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating availability',
    });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  updateMenuAvailability,
};