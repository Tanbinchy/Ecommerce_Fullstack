const app = require("./app");
const connectDB = require("./config/dbConnect");
const { serverPort } = require("./secret");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(serverPort, () => {
      console.log(`SERVER RUNNING AT :- http://localhost:${serverPort}...`);
    });
  } catch (error) {
    console.error("SERVER STARTUP FAILED:", error.message);
    process.exit(1);
  }
};

startServer();
