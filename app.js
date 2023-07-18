require("dotenv").config();
require("express-async-errors");
const path = require("path");
// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();
// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
// extra middlewares
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authenticateUser, jobsRoute);

// serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
