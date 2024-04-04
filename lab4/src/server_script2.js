import http from "node:http";
import fs from "node:fs";
/**
 * The requestListener function is the function that is executed each time the server gets a request.
 * @param {IncomingMessage} req - The first parameter, the Request object, represents an IncomingMessage object.
 * @param {ServerResponse} res - 	The second parameter represents a ServerResponse object, which has methods for handling the response stream back to the user
 *  @author Tomasz Kurcoń
 */
const requestListenerScript2 = (req, res) => {
  const url = req.url;
  const method = req.method;
  switch ([method, url].join(" ")) {
    case "GET /": {
      fs.readFile("data.txt", (err, data) => {
        res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Księga gości</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
    />
  </head>
  <body class="p-4">
    <div>
    `);
        if (data) {
          res.write(data.toString());
          res.write("<hr>");
        }
        res.write(`
    
      <form action="/" method="POST">
      <fieldset>
        <legend>Nowy wpis:</legend>
        <div class="d-flex flex-column w-50 gap-2 align-item-start">
          <div class="form-group">
            <label for="name">Twoje imię i nazwisko</label>
            <input
              type="text"
              class="form-control"
              name="name"
              placeholder="Jerzy Wiśniewski"
            />
          </div>
          <div class="form-group">
            <label for="content">Treść wpisu</label>
            <textarea
              class="form-control"
              name="content"
              rows="3"
              placeholder="Proszę o kontakt osoby, które ze mną studiowały — tel. 12 345 67 89 "
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary align-self-start">Dodaj wpis</button>
        </div>
      </fieldset>
      </form>
    </div>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossorigin="anonymous"
    ></script>
  </body>
</html>`);
        res.end();
      });

      break;
    }
    case "POST /": {
      const body = [];
      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        const parsedBody = Buffer.concat(body).toString();
        const data = parsedBody
          .split("&")
          .map((el) =>
            decodeURIComponent(el.split("=")[1].replace(/\+/g, " "))
          );

        fs.appendFile(
          "data.txt",
          `<h1>${data[0]}</h1><p>${data[1]}</p> \n`,
          (err) => {
            if (err) console.log(err);
            res.writeHead(302, { Location: "/" });
            res.end();
          }
        );
      });
      break;
    }
  }
};

/**
 * Serwer HTTP
 * @type {http.server}
 */
const server = http.createServer(requestListenerScript2);

server.listen(3000);
