import express from "express";
import expressGraphQL from "express-graphql";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "express-jwt";

import schema from "./graphql/GraphqlSchema";
import ValidationError from "./graphql/ValidationError";

const app = express();

dotenv.config();
const PORT = process.env.PORT || "3001";
const db = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const auth = jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
});

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
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
  auth,
  expressGraphQL((req) => {
    return {
      schema,
      graphiql: true,
      context: {
        authenticatedUser: req.user,
        JWT_SECRET,
      },
      formatError: (error) => {
        if (error.originalError instanceof ValidationError) {
          return {
            message: error.message,
            validationErrors:
              error.originalError && error.originalError.validationErrors,
          };
        }
        return error;
      },
    };
  })
);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
