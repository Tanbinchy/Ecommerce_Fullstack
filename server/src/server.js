const app = require("./app");
const connectDB = require("./config/dbConnect");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`SERVER RUNNING AT :- http://localhost:${serverPort}...`);
  await connectDB();
});
