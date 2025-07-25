const logger = require("../logger");

const roles = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log("JWT payload:", req.user); // debug
    const userRole = req.user?.role;
    // console.log("User role:", userRole);
    // console.log("Allowed roles:", allowedRoles);

    if (!userRole || !allowedRoles.includes(userRole)) {
      logger.info("Access Denied");
      // console.log("Access Denied");
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
module.exports = roles;
