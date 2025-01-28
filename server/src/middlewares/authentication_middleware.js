// Call this function on requests to check if user is authenticated.
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.authToken;
  if (token) {
    next();
  } else {
    res.redirect("/login"); // Have decide the "login page route"
  }
};

export default isAuthenticated;
