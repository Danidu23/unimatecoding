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

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

const requireStaffOrAdmin = (req, res, next) => {
  if (!["staff", "admin"].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: "Staff or admin access only",
    });
  }
  next();
};

const requireSportsAdmin = (req, res, next) => {
  const isSportsAdmin =
    req.user?.role === "admin" &&
    req.user?.permissions?.includes("sports_admin");

  if (!isSportsAdmin) {
    return res.status(403).json({
      success: false,
      message: "Sports admin access only",
    });
  }

  next();
};

module.exports = {
  requireStudent,
  requireStaff,
  requireAdmin,
  requireStaffOrAdmin,
  requireSportsAdmin
};