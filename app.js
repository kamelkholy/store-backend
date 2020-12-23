const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const categoriesRouter = require("./Routes/Admin/categories");
const typesRouter = require("./Routes/Admin/types");
const brandsRouter = require("./Routes/Admin/brands");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/categories", categoriesRouter);
app.use("/types", typesRouter);
app.use("/brands", brandsRouter);

mongoose.connect(
  "mongodb://storeuser:VV36E7UySY34YnYx@cluster0-shard-00-00.koyhn.mongodb.net:27017,cluster0-shard-00-01.koyhn.mongodb.net:27017,cluster0-shard-00-02.koyhn.mongodb.net:27017/storedb?ssl=true&replicaSet=atlas-eefgk6-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db on");
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
