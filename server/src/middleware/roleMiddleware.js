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

const requireSportsManager = (req, res, next) => {
  const isAdmin = req.user?.role === "admin";
  const isSportsStaff =
    req.user?.role === "staff" && req.user?.staffType === "sports";

  if (!isAdmin && !isSportsStaff) {
    return res.status(403).json({
      success: false,
      message: "Sports manager access only",
    });
  }

  next();
};

module.exports = {
  requireStudent,
  requireStaff,
  requireAdmin,
  requireStaffOrAdmin,
  requireSportsManager
};