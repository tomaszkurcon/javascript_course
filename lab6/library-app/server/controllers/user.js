const { getDb } = require("../utils/db");
const convert = require('xml-js');

exports.getUsers = (req, res) => {
  const db = getDb();
  db.collection("users")
    .find()
    .toArray()
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

exports.getBooks = (req, res) => {
  const db = getDb();
  db.collection("books")
    .find()
    .toArray()
    .then((books) => {
      const booksWithIdAsString = books.map(book => ({
        ...book,
        _id: book._id.toString() 
      }));
      const options = {compact: true, ignoreComment: true, spaces: 4};
      let xml = convert.json2xml({"data":[{"books":booksWithIdAsString}]}, options);
      res.set('Content-Type', 'text/xml');
      res.status(200).send(xml);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

exports.deleteReturnBook = async (req, res) => {
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
  const { book_name, username, book_img } = req.body;
  const book = await db.collection("books").findOne({ book_name: book_name });

  try {
    if (book.amount < 1) {
      throw new Error("Book is no available");
    }
    let user = await db.collection("users").findOne({ username });
    if (!user) {
      user = await db.collection("users").insertOne({ username });
    }
    await db
      .collection("books")
      .updateOne({ book_name: book_name }, { $inc: { amount: -1 } });
    db.collection("rentals")
      .insertOne({
        username: username,
        book_name: book_name,
        book_img: book_img,
      })
      .then((r) => {
        res.status(200).send({ message: "Book borrowed" });
      });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
