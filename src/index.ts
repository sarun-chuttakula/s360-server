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
import { Group, Message } from "./models";
const PORT = process.env.PORT || 4000;
const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup());
app.use(Router);

//on connection event
io.on("connect", (socket: any) => {
  socket.on("clientMsg", async (data: any) => {
    console.log(data);
    const messageRepository = AppDataSource.manager.getRepository(Message);
    const groupRepository = AppDataSource.manager.getRepository(Group);
    const newMessage = new Message();
    const group = await groupRepository.findOne({ where: { id: data.group } });
    const sending = await messageRepository.save({
      ...newMessage,
      ...data,
      group: group,
      created_by: data.sender,
      updated_by: data.sender,
    });
    io.sockets.emit("serverMsg", sending);
  });
});

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
