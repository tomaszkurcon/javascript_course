import {
  DataTypes,
  addData,
  checkData,
  deleteObject,
  getData,
  getObject,
  updateObject,
} from "./helpers";

export const openDb = async () => {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("libraryDatabase", 1);
    request.onupgradeneeded = function (event) {
      console.log("in");
      let db = event.target.result;
      db.createObjectStore("user", { keyPath: "username", unique: true });
      const userStore = db.createObjectStore("book", {
        keyPath: "book_name",
        unique: true,
      });
      db.createObjectStore("rental", {
        keyPath: "id",
        autoIncrement: true,
        unique: true,
      });

      userStore.transaction.oncomplete = (event) => {
        let transaction = db.transaction(["book"], "readwrite");
        let objStore = transaction.objectStore("book");
        objStore.add({
          book_name: "Java podstawy",
          authors: ["Jan Kowalski", "Maurcy Heńko"],
          faculty: "Wydział IET",
          subject: "Cyberbezpieczeństwo",
          course: "Programowanie skryptowe",
          imgURL: "./src/images/java_book.jpg",
          amount: 5,
        });
        objStore.add({
          book_name: "C++ dla początkujących",
          authors: ["Albert pięta"],
          faculty: "Wydział GGiOŚ",
          subject: "Geoinformatyka",
          course: "Geologia ogólna",
          imgURL: "./src/images/cpp_book.jpg",
          amount: 10,
        });
        objStore.add({
          book_name: "Programming Python",
          authors: ["Mark Lutz"],
          faculty: "Wydział Humanistyczny",
          subject: "Informatyka społeczna",
          course: "Grafika komputerowa",
          imgURL: "./src/images/python_book.jpg",
          amount: 1,
        });
          objStore.add({
          book_name: "Javascript techniki zaawansowane",
          authors: ["Tomasz Sochakci"],
          faculty: "Wydział IET",
          subject: "Informatyka",
          course: "Technologie internetowe",
          imgURL: "./src/images/js.jpg",
          amount: 20,
        });
      };
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject("Error occured");
    };
  });
};

export async function get_books(db) {
  const books = await getData("book", db);
  return books;
}

export async function borrow_book(data, db) {
  try {
    checkData(data, DataTypes.BorrowBookData);
  } catch (err) {
    console.error(err);
    return;
  }
  const { username, book_name } = data;
  const user = await getObject("user", username, db);
  !user && (await addData("user", { username: username }, db));
  const book = await getObject("book", book_name, db);
  if (!book) {
    console.error("Book ", book_name, "doesn't exist");
    window.alert(`Book "${book_name}" doesn't exist`)
  } else if (parseInt(book["amount"]) <= 0) {
    console.error("Currently all books: ", book_name, "are borrowed");
    window.alert(`Currently all books: "${book_name}"are borrowed`);
  } else {
    await addData(
      "rental",
      { username: username, book_name: book_name },
      db,
      () => {
        if (!alert("You have succesfully borrowed book!")) {
          window.location.reload();
        }
      }
    );
    book["amount"] -= 1;
    await updateObject("book", book, db);
  }
}

export async function return_book(data, db) {
  try {
    checkData(data, DataTypes.ReturnBookData);
  } catch (err) {
    console.error(err);
    return;
  }
  const { username, book_name } = data;
  const user = await getObject("user", username, db);
  const book = await getObject("book", book_name, db);
  try {
    if (!user) throw new Error(`User ${username} doesn't exist`);
    if (!book) throw new Error(`Book ${book_name} doesn't exist`);
    const rental_record = await getData(
      "rental",
      db,
      [
        ["username", (p_username) => p_username === user.username],
        ["book_name", (p_book_name) => p_book_name === book.book_name],
      ],
      true
    );
    if (rental_record.length) {
      deleteObject("rental", rental_record[0].id, db);
      console.log(rental_record);
      const book = await getObject("book", rental_record[0].book_name, db);
      book["amount"] += 1;
      console.log(book);
      await updateObject("book", book, db);
      console.log("You have succesfully returned book :)");
      if (!alert("You have succesfully returned book :)"))  {window.location.reload();}
    
    } else {
      throw new Error(username + " hasn't borrowed book: " + book_name);
    }
  } catch (err) {
    console.error(err);
    window.alert(err);
  }
}

export async function show_book_users(book, db) {
  const users = await getData("rental", db, [
    ["book_name", (p_book_name) => p_book_name == book],
  ]);
  return users;
}
export async function show_user_books(username, db) {
  try {
    checkData({username:username}, DataTypes.ShowUserBooks);
  } catch (err) {
    console.error(err);
    return;
  }
  try {
    const user = await getObject("user", username, db);
    if (!user) throw new Error(`User ${username} doesn't exist`);
    const books = await getData("rental", db, [
      ["username", (p_username) => username == p_username],
    ]);
    console.log(
      "Books that ",
      username,
      " has borrowed and not returned yet:"
    );
    console.log(books);
    return books;
  } catch (err) {
    window.alert(err);
    console.error(err);
  }
}

