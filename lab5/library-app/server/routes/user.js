const express = require("express");
const controllers = require("../controllers/user");
const router = express.Router();

router.get("/books", controllers.getBooks);
router.post("/return_book", controllers.postReturnBook);
router.post("/borrow_book", controllers.postBorrowBook);

module.exports = router;
