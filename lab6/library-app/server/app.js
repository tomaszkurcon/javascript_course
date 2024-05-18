const express = require("express");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const cors = require("cors");
const mongoConnect = require("./utils/db").mongoConnect;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json({ limit: "50mb" }));
app.use("/auth", authRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);

mongoConnect(() => {
  app.listen(8000, () => {
    console.log("The server was started on port 8000");
    console.log('To stop the server, press "CTRL + C"');
  });
});
