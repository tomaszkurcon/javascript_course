/**
 * @author Stanisław Polak <polak@agh.edu.pl>
 */

import express from "express";
import morgan from "morgan";

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();

app.locals.pretty = app.get("env") === "development"; // The resulting HTML code will be indented in the development environment

/* ************************************************ */

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static("public"));


let students = [
    {
          name: 'Jan',
          lastname: 'Kowalski',
    },
    {
          name: 'Anna',
          lastname: 'Nowak'
    },
];

/* ******** */
/* "Routes" */
/* ******** */

/* ------------- */
/* Route 'GET /' */
/* ------------- */
app.get("/", (request, response) => {
//   response.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//        <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1">
//           <title>First Express application</title>
//        </head>
//        <body>
//           <main>
//              <h1>First Express application</h1>
//              <form method="GET" action="/submit">
//                 <label for="name">Give your name</label>
//                 <input name="name">
//                 <br>
//                 <input type="submit">
//                 <input type="reset">
//              </form>
//              <img src="images/java_book.jpg" alt="image">
//           </main>
//        </body>
//     </html>    
//            `);
  response.render('index', {students_list: students}); // Render the 'index' view
});

app.get("/submit", (request, response) => {
  // Processing the form content, if the relative URL is '/submit', and the GET method was used to send data to the server'
  /* ************************************************** */
  // Setting an answer header — we inform the browser that the returned data is plain text
  response.set("Content-Type", "text/plain");
  /* ************************************************** */
  // Place given data (here: 'Hello <name>') in the body of the answer
  response.send(`Hello ${request.query.name}`); // Send a response to the browser
});

app.post("/", (request, response) => {
  response.send(`Hello ${request.body.name}`);
});

/* ************************************************ */

app.listen(8000, () => {
  console.log("The server was started on port 8000");
  console.log('To stop the server, press "CTRL + C"');
});
