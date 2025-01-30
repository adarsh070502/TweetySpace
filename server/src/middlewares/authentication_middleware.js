import jwt from "jsonwebtoken";

// Call this function on requests to check if user is authenticated.
const isAuthenticated = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    // Verify the token
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    // Attach user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token. Access denied." });
  }
};

export default isAuthenticated;
