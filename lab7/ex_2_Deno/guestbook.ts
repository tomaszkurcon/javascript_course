/**
 * @author Stanisław Polak <polak@agh.edu.pl>
 */

// @deno-types="npm:@types/express@^4"
import express, { Express, Request, Response } from "npm:express@^4";
import "npm:pug@^3";
import { getDb, mongoConnect } from "./utils/db.ts";
import { Database } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

const app: Express = express();

app.set("view engine", "pug");
app.locals.pretty = app.get("env") === "development";

app.use(express.urlencoded({ extended: false }));

app.get("/", async function (req: Request, res: Response) {
  const db : Database = getDb();
  const guests = await db.collection("guests").find().toArray();
  res.render("index", {guests});
});

app.post("/", async function (req: Request, res: Response) {
  const db = getDb();
  const { name, content } = req.body;
  try {
    await db.collection("guests").insertOne({ name, content });
  } catch (err) {
    console.log(err);
  }
  res.send(`Hello '${name}'`);
});
mongoConnect(() => {
  app.listen(8000, function () {
    console.log("The application is available on port 8000");
  });
});
