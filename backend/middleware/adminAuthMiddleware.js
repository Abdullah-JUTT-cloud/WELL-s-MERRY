import jwt from "jsonwebtoken";

export const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_ACCESS_SECRET);
    if (decoded.type !== "admin") throw new Error("Not admin token");
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};
