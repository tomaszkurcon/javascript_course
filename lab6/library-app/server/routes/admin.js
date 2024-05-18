const express = require("express");
const basicAuth = require("express-basic-auth");
const controllers = require("../controllers/admin");
const router = express.Router();

// const authorizer = (username, password) => {
//   const userMatches = basicAuth.safeCompare(username, "admin");
//   const passwordMatches = basicAuth.safeCompare(password, "password");
//   return userMatches & passwordMatches;
// };
const getUnAuthorizedResponse = (req) => {
  return req.auth
    ? {
        error:
          "Credentials " +
          req.auth.user +
          ":" +
          req.auth.password +
          " rejected",
      }
    : { error: "No credentials provided" };
};
router.use(
  basicAuth({
    users: { admin: "password" },
    unauthorizedResponse: getUnAuthorizedResponse,
  }),
  (req, res, next) => {
    console.log(req.auth);
    next();
  }
);

router.get("/user_books", controllers.getShowUserBooks);
router.get("/book_users", controllers.getShowBookUsers);
router.post("/add_book", controllers.postAddBook);
router.post("/sell_book", controllers.postSoldBook);
module.exports = router;
