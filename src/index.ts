import AppDataSource from "./configs/data-source";
// import "module-alias/register";
import "dotenv/config";
import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import "reflect-metadata";
import bodyParser from "body-parser";
import Router from "./routes";
import logger from "./utils/logger.util";
import { Server, Socket } from "socket.io";
import http, { request } from "http";
import { ClientToServerEvents, ServerToClientEvents } from "./types/typings";
import { randomUUID } from "crypto";
// import { generateCreateTableScript } from "./utils/genSQL.util";
const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
}); //this is socket io which is used for real time communication between client and server
// generateCreateTableScript();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup());
app.use(Router);

//on connection event
//on connection event
io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    socket.on("clientMsg", (data: any) => {
      console.log(data);
      data["id"] = randomUUID();

      if (data.group_id === "") {
        io.sockets.emit("serverMsg", data);
      } else {
        socket.join(data.group_id);
        io.to(data.group_id).emit("serverMsg", data);
      }
    });
  }
);

export { io };
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});

AppDataSource.initialize()
  .then(async () => {
    logger.info("Database connected");
  })
  .catch((error) => console.log(error));
