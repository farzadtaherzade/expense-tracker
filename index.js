const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Server = require("./app/server");
console.log(process.env.emailPassword);
new Server(process.env.PORT, "mongodb://localhost:27017/expenseDB");
