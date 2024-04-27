const { getDb } = require("../utils/db");

exports.getBooks = (req, res) => {
  const db = getDb();
  db.collection("books")
    .find()
    .toArray()
    .then((books) => {
      res.status(200).send({ data: books });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

exports.postReturnBook = async (req, res) => {
  const db = getDb();
  const { book_name, username } = req.body;
  try {
    const result = await db
      .collection("rentals")
      .deleteOne({ username: username, book_name: book_name });
    if (!result.deletedCount) {
      throw new Error("Entered user hasn't borrowed this book");
    }
    await db
      .collection("books")
      .updateOne({ book_name: book_name }, { $inc: { amount: 1 } });
    res.status(200).send({ message: "Book returned" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
};

exports.postBorrowBook = async (req, res) => {
  const db = getDb();
  const { book_name, username } = req.body;
  const book = db.collection("books").find({ book_name: book_name });
  try {
    if (book.amount < 1) {
      throw new Error("Book is no available");
    }
    await db
      .collection("books")
      .updateOne({ book_name: book_name }, { $inc: { amount: -1 } });
    db.collection("rentals")
      .insertOne({ username: username, book_name: book_name })
      .then((r) => {
        res.status(200).send({ message: "Book borrowed" });
      });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
