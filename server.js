require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const schema = require("./schema");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`[MongoDB] connected successfully`))
  .catch(err => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(PORT, err => {
  console.error(err);
  console.log(`[Server] listening on port ${PORT}`);
});
