const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
const allroutes = require("./controller/index");
const moment = require("moment");
const soment = require("moment-timezone");
const allRoutes = require("./routes/Routes");
const mailSender = require("./utils/Nodemailer");
const otpTemplate = require("./templets/emailVerificationTemplate");
//
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const PORT = process.env.PORT || 2000;
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api/v1", allRoutes);
io.on("connection", (socket) => {});

let x = true;
let trx = true;

if (x) {
  // generateAndSendMessage();
  console.log("Waiting for the next minute to start...");
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();
  console.log(
    "start after ",
    moment(new Date()).format("HH:mm:ss"),
    secondsUntilNextMinute
  );
               // allroutes.trxResultSendToBackEnd();
      // aviator_Start_function(io);
    // allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
    // allroutes.generatedTimeEveryAfterEveryOneMin(io);
    // allroutes.generatedTimeEveryAfterEveryThreeMin(io);
    // allroutes.generatedTimeEveryAfterEveryFiveMin(io);
  setTimeout(() => {
    allroutes.generatedTimeEveryAfterEveryOneMin(io);
    allroutes.generatedTimeEveryAfterEveryOneMinTRX(io);
    x = false;
  }, secondsUntilNextMinute * 1000);
}
// mailSender("vermaanand278@gmail.com", "THis is simple tile", otpTemplate(9918))
////////////
httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
