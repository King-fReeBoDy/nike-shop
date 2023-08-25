const permissions = (req, res, id) => {
  if (req.user.role === "admin") return;
  if (req.user.id === id) return;
  return res.status(401).json({ success: false, message: "Not authorized" });
};

module.exports = permissions;
