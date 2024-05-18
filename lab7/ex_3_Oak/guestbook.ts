import {
  Application,
  Router,
  Context,
  // send
} from "https://deno.land/x/oak@v16.0.0/mod.ts";
import {
  dejsEngine,
  oakAdapter,
  viewEngine,
} from "https://deno.land/x/view_engine@v10.6.0/mod.ts";
import logger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";
import { getDb, mongoConnect } from "./utils/db.ts";
import { Database } from "https://deno.land/x/mongo@v0.33.0/mod.ts";

const app: Application = new Application();
const router: Router = new Router({});
app.use(logger.logger);
app.use(logger.responseTime);
app.use(viewEngine(oakAdapter, dejsEngine, { viewRoot: "./views" }));
router.get("/", async (ctx: Context) => {
  const db: Database = getDb();
  const guests = await db.collection("guests").find().toArray();
  await ctx.render("index.ejs", {
    guests,
  });
});

router.post("/", async (ctx: Context) => {
  const db: Database = getDb();
  try {
    const reqBodyValue = await ctx.request.body.formData();
    await db.collection("guests").insertOne({
      name: reqBodyValue.get("name"),
      content: reqBodyValue.get("content"),
    });
    ctx.response.body = `Hello '${reqBodyValue.get("name")}'`;
  } catch (err) {
    console.log(err);
    ctx.response.body = `Error`;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
mongoConnect(() => {
  app.listen({ port: 8000 });
  console.log("App is listening to port: 8000");
});
