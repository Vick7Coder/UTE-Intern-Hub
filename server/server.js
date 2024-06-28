import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"; // logging middleware
import helmet from "helmet";
import xss from "xss-clean"; // data sanitization
import mongoSanitize from "express-mongo-sanitize"; // data sanitization
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

const allowedOrigins = ['*'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

// Preflight request handling
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log("DB Connection Failed: " + err));

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});