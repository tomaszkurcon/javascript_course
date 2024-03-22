import {
  openDb,
  addData,
  getObject,
  getData,
  DataTypes,
  checkData,
  deleteObject,
  updateObject,
} from "./indexDb.js";

function create_commands(commandDesc) {
  const commands = {};
  for (const cmd of commandDesc) {
    commands[cmd.cmdName] = cmd.cmd;
  }
  return commands;
}

openDb()
  .then((db) => {
    const commandsList = [
      {
        cmdName: "borrow_book",
        cmd: borrow_book,
        cmdDescription:
          "Funkcja pozwala użytkownikowi wypożyczyć książkę z biblioteki. Jako parametry przyjmuje nazwę użytkownika i nazwę książki. Jeżeli użytkownik nie istnieje to tworzy nowego użytkownika o podanej nazwie.",
        input: DataTypes.BorrowBookData,
      },
      {
        cmdName: "return_book",
        cmd: return_book,
        cmdDescription:
          "Funkcja pozwala użytkownikowi zwrócić wypożyczoną książkę do biblioteki. Jako parametry przyjmuje nazwę użytkownika i nazwę książki.",
        input: DataTypes.ReturnBookData,
      },
      {
        cmdName: "add_book",
        cmd: add_book,
        cmdDescription:
          "Funkcja pozwala dodać nową książkę do biblioteki. Jako parametry przyjmuje nazwę książki, autorów, wydział,kierunek studiów oraz ilość egzemplarzy.",
        input: DataTypes.BookData,
      },
      {
        cmdName: "show_books",
        cmd: show_books,
        cmdDescription:
          "Funkcja wyświetla wszystkie książki dostępne w bibliotece. Nie przyjmuje żadnych parametrów.",
        input: {},
      },
      {
        cmdName: "show_user_books",
        cmd: show_user_books,
        cmdDescription:
          "Funkcja wyświetla wszystkie książki wypożyczone przez danego użytkownika. Jako parametr przyjmuje nazwę użytkownika.",
        input: DataTypes.ShowUserBooks,
      },
    ];
    // const commands = {
    //     borrow_book,
    //     return_book,
    //     add_book,
    //     show_books,
    //     show_user_books
    // }

    document.forms[0].addEventListener("submit", execute_command);

    const commands = create_commands(commandsList);

    function execute_command(e) {
      e.preventDefault();
      const input = document.forms[0].elements.command_input.value;

      const command = input.split(" ")[0].toLowerCase();
      let separatorIndex = input.indexOf(" ");
      const data = input.substring(separatorIndex + 1);

      if (!commands[command]) {
        console.error("Command ", command, "is not recognized");
        console.log("Here is your command reminder: ");
        console.log(commandsList);
        console.log("Enter command following this pattern: ");
        console.log(`cmdName {"parameter1":"value", "parameter2":"value"}`);
      } else {
        commands[command](data);
      }
      //   switch (command) {
      //     case "borrow_book":
      //       borrow_book(data);
      //       break;
      //     case "return_book":
      //       return_book(data);
      //       break;
      //     case "add_book":
      //       add_book(data);
      //       break;
      //     case "show_books":
      //       show_books();
      //       break;
      //     case "show_user_books":
      //       show_user_books(data);
      //       break;
      //     default:
      //       console.error("Command ", command, "is not recognized");
      //   }
    }
    async function borrow_book(data) {
      let parsed_data;
      try {
        parsed_data = JSON.parse(data);
        checkData(parsed_data, DataTypes.BorrowBookData);
      } catch (err) {
        console.error(err);
        return;
      }
      const { username, book_name } = parsed_data;
      const user = await getObject("user", username, db);
      !user && (await addData("user", { username: username }, db));
      const book = await getObject("book", book_name, db);
      if (!book) {
        console.error("Book ", book_name, "doesn't exist");
      } else if (parseInt(book["amount"]) <= 0) {
        console.error("Currently all books: ", book_name, "are borrowed");
      } else {
        await addData(
          "rental",
          { username: username, book_name: book_name },
          db,
          "You have succesfully borrowed book!"
        );
        book["amount"] -= 1;
        await updateObject("book", book, db);
      }
    }
    async function return_book(data) {
      let parsed_data;
      try {
        parsed_data = JSON.parse(data);
        checkData(parsed_data, DataTypes.ReturnBookData);
      } catch (err) {
        console.error(err);
        return;
      }
      const { username, book_name } = parsed_data;
      const user = await getObject("user", username, db);
      try {
        if (!user) throw new Error(`User ${username} doesn't exist`);
        const rental_record = await getData(
          "rental",
          db,
          [["username", (p_username) => p_username === user.username]],
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
        } else {
          console.log(
            username,
            " hasn't borrowed book: ",
            book_name,
            " or such book doesn't exist"
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
    async function add_book(data) {
      const book_data = JSON.parse(data);
      try {
        checkData(book_data, DataTypes.BookData);
      } catch (err) {
        console.error(err);
        return;
      }
      await addData("book", book_data, db, "You have succesfully added book!");
    }
    async function show_books() {
      const books = await getData("book", db, []);
      let i = 1;
      for (const book of books) {
        const users = await getData("rental", db, [
          ["book_name", (book_name) => book_name == book.book_name],
        ]);
        console.log(i);
        console.log("Book: ", book);
        console.log("Users that borrowed this book: ", users);
        i += 1;
      }
    }
    async function show_user_books(data) {
      let parsed_data;
      try {
        parsed_data = JSON.parse(data);
        checkData(parsed_data, DataTypes.ShowUserBooks);
      } catch (err) {
        console.error(err);
        return;
      }
      const { username } = parsed_data;

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
      } catch (err) {
        console.error(err);
      }
    }
  })
  .catch((err) => console.error(err));

