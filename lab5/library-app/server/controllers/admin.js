const { getDb } = require("../utils/db");
const { isValidBookJSON } = require("../utils/isValidBookJSON");

exports.getShowUserBooks = async (req, res) => {
  const db = getDb();
  const username = req.query.username;
  const user_rentals = await db
    .collection("rentals")
    .find({ username: username })
    .toArray();
  res.status(200).send(user_rentals);
};

exports.getShowBookUsers = async (req, res) => {
  const db = getDb();
  const book_name = req.query.book_name;
  const book_rentals = await db
    .collection("rentals")
    .find({ book_name: book_name })
    .toArray();
  res.status(200).send(book_rentals);
};

exports.postAddBook = async (req, res) => {
  const db = getDb();
  const book_data = req.body;

  if (!isValidBookJSON(book_data)) {
    res.status(400).send({ error: "Invalid Book JSON" });
    return;
  }
  const existingBook = await db
    .collection("books")
    .findOne({ book_name: book_data.book_name });
  if (existingBook) {
    res.status(400).send({ error: "Book with this name already exists" });
    return;
  }

  const result = await db.collection("books").insertOne(book_data);
  res.status(200).send({ message: "Book added" });
};
