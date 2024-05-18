const express = require("express");
const controllers = require("../controllers/user");
const router = express.Router();

router.get("/users", controllers.getUsers);

router.get("/books", controllers.getBooks);
router.delete("/return_book", controllers.deleteReturnBook);
router.post("/borrow_book", controllers.postBorrowBook);

module.exports = router;
