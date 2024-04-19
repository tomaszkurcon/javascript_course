const http = require("http");
const url = require("url");
const { readFile, writeFile } = require("fs");

function requestListener(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

  res.setHeader("Access-Control-Allow-Credentials", "true");
  let parsedUrl = new url.URL(req.url, "http://localhost:5173");
  let pathname = parsedUrl.pathname;
  const method = req.method;
  let searchParams = new url.URLSearchParams(parsedUrl.search);

  switch ([method, pathname].join(" ")) {
    case "GET /books":
      {
        res.writeHead(200, { "Content-Type": "application/json" });
        readFile("data/books.json", (err, data) => {
          if (err) throw err;
          let jsonData = JSON.parse(data);
          res.end(JSON.stringify(jsonData));
        });
      }
      break;
    case "POST /return_book": {
      const body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        const parsedBodyJson = Buffer.concat(body).toString();

        readFile("data/rentals.json", (err, data) => {
          if (err) throw err;

          let rentalsData = JSON.parse(data);
          let parsedBody = JSON.parse(parsedBodyJson);
          let rental_index = -1;
          for (let i = 0; i < rentalsData.rentals_list.length; i++) {
            if (
              rentalsData.rentals_list[i].username == parsedBody.username &&
              rentalsData.rentals_list[i].book_name == parsedBody.book_name
            ) {
              rental_index = i;
              break;
            }
          }
          if (rental_index == -1) {
            res.writeHead(404, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            res.end("Couldn't return book");
            return;
          }
          rentalsData.rentals_list = [
            ...rentalsData.rentals_list.slice(0, rental_index),
            ...rentalsData.rentals_list.slice(rental_index + 1),
          ];
          writeFile("data/rentals.json", JSON.stringify(rentalsData), () => {});

          readFile("data/books.json", (err, data) => {
            if (err) throw err;
            let jsonData = JSON.parse(data);
            jsonData.books_list.map((book) => {
              if (book.book_name == parsedBody.book_name) {
                book.amount += 1;
              }
            });
            writeFile("data/books.json", JSON.stringify(jsonData), () => {
              res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
              });
              res.end();
            });
          });
        });
      });

      break;
    }
    case "POST /borrow_book": {
      const body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        const parsedBodyJson = Buffer.concat(body).toString();
        readFile("data/books.json", (err, data) => {
          if (err) throw err;
          let parsedBody = JSON.parse(parsedBodyJson);
          let borrowedFlag = false;
          let jsonData = JSON.parse(data);
          jsonData.books_list.map((book) => {
            if (book.book_name == parsedBody.book_name && book.amount > 0) {
              book.amount -= 1;
              borrowedFlag = true;
            }
          });
          if (!borrowedFlag) {
            res.writeHead(404, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            res.end("Couldn't borrow book");
            return;
          }
          writeFile("data/books.json", JSON.stringify(jsonData), () => {});
          readFile("data/rentals.json", (err, data) => {
            if (err) throw err;
            let rentalsData = JSON.parse(data);
            rentalsData.rentals_list.push({
              username: parsedBody.username,
              book_name: parsedBody.book_name,
            });

            writeFile("data/rentals.json", JSON.stringify(rentalsData), () => {
              res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
              });
              res.end();
            });
          });
        });
      });

      break;
    }
    case "GET /show_reader_books": {
      const username = searchParams.get("username");
      readFile("data/rentals.json", (err, data) => {
        if (err) throw err;
        let rentalsData = JSON.parse(data);
        let books = [];
        rentalsData.rentals_list.map((rental) => {
          if (rental.username == username) {
            books.push(rental.book_name);
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
      });
      break;
    }
    case "GET /show_book_readers": {
      const book_name = searchParams.get("book_name");
      readFile("data/rentals.json", (err, data) => {
        if (err) throw err;
        let rentalsData = JSON.parse(data);
        let readers = [];
        rentalsData.rentals_list.map((rental) => {
          if (rental.book_name == book_name) {
            readers.push(rental.username);
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(readers));
      });

      break;
    }
    default: {
      res.writeHead(404);
      res.end();
      break;
    }
  }
}

const server = http.createServer(requestListener);
server.listen(3000);
