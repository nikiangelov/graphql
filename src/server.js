import express from "express";
import expressGraphQL from "express-graphql";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import schema from "./graphql/GraphqlSchema";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || "3001";
const db = process.env.MONGODB_URL;
const SECRET = process.env.LOGIN_SECRET;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(
  "/graphql",
  cors(),
  bodyParser.json(),
  expressGraphQL({
    schema,
    graphiql: true,
    context: {
      SECRET,
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
