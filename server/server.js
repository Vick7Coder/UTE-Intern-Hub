import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import morgan from "morgan"; // logging middlware - used to log requests,erros and more
import helmet from "helmet";

import xss from "xss-clean"; //data sanitization against XSS (cross site scripting)

import mongoSanitize from "express-mongo-sanitize"; //data sanitization against query injection

import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet()); // it secures our application by setting several HTTP headers.

//data sanitization middlewares
app.use(xss());
app.use(mongoSanitize());

app.use(morgan("dev"));
// here the dev is a preset (it means pre defined logging format),which is ideal for development cause the format includes http method, url, color-coded status codes, response time, and content length
// there are other presets like dev, which are tiny, short, combined and common - you can check it out

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected SuccessFully"))
  .catch((err) => console.log("DB Connection Failed : " + err));

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});