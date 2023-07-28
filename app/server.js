const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const createError = require("http-errors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const { AllRoutes } = require("./routes/routes");
module.exports = class Server {
  #app = express();
  #DB_URI;
  #PORT;
  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configServer();
    this.connectToMongoDB();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }
  configServer() {
    this.#app.use(cors());
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      "/api-doc",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsDoc({
          swaggerDefinition: {
            info: {
              title: "Node Store",
              version: "2.0.0",
              description: "its a node sore",
            },
            servers: [
              {
                url: "http:localhost:5000",
              },
            ],
          },
          apis: ["./app/routes/**/*.js"],
        })
      )
    );
  }
  createServer() {
    const http = require("http");
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log("Run > http://localhost:" + this.#PORT);
    });
  }
  connectToMongoDB() {
    mongoose.connect(this.#DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    mongoose.connection.on("connected", () => {
      console.log("connected to MongoDB");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("faild to connect to MongoDB");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("disconnected");
      process.exit(0);
    });
  }
  createRoutes() {
    this.#app.use(AllRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        statusCode: createError.NotFound,
        message: "آدرس مورد نظر یافت نشد",
      });
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;

      return res.status(statusCode).json({
        data: null,
        errors: {
          statusCode,
          message,
        },
      });
    });
  }
};
