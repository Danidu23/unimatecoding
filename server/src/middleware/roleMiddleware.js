const requireStudent = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Student access only',
    });
  }

  next();
};

const requireStaff = (req, res, next) => {
  if (req.user?.role !== 'staff') {
    return res.status(403).json({
      success: false,
      message: 'Staff access only',
    });
  }

  next();
};

module.exports = {
  requireStudent,
  requireStaff,
};