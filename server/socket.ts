import WebSocket from "ws";
import { UserModel, UserWorker, IUser, IMessage } from "./model/users";
import mongoose from "mongoose";

let clinets: {
  id: mongoose.Types.ObjectId;
  client: any;
}[];
export const socket: () => void = async () => {
  const webSocket = await new WebSocket.Server({ port: 8080 }, () => {
    console.log("> Websocket Server stablished !!!!!!!");
  });

  webSocket.on("connection", (socket: WebSocket): void => {
    console.log("everyThing is fine and connection is Stablished !!!!!!");

    socket.on("error", async (err: Error) => {
      socket.send("error on connection !!!" + err);
    });

    socket.on("message", async (inMsg: string) => {
      console.log(inMsg);
      const msgParts = inMsg.toString().split("_");
      switch (msgParts[0]) {
        case "connection":
          try {
            await UserWorker.connect();
            let _user: IUser = await new UserWorker(UserModel).findOne(
              mongoose.Types.ObjectId(msgParts[1])
            );
            await UserWorker.close();
            clinets.push({
              id: _user.id,
              client: socket,
            });
            socket.send(_user);
          } catch (ex) {
            socket.send("failed to catch user : " + ex);
          }
          break;
        case "msg":
          try {
            const msg: IMessage = {
              from: msgParts[1],
              to: msgParts[2],
              body: msgParts[3],
            } as IMessage;
            await UserWorker.connect();
            let _send = await new UserWorker(UserModel).findOne(
              mongoose.Types.ObjectId(msg.from)
            );
            let _receiver = await new UserWorker(UserModel).findOne(
              mongoose.Types.ObjectId(msg.to)
            );
            _send.messages.push(msg);
            _receiver.messages.push(msg);
            await _send.save();
            await _receiver.save();
            await UserWorker.close();
            const cl = clinets.find(
              (item) => item.id === mongoose.Types.ObjectId(msg.to)
            );
            webSocket.clients.forEach((clinet: WebSocket) => {
              if (
                cl !== undefined &&
                clinet.readyState === WebSocket.OPEN &&
                clinet === cl.client
              ) {
                clinet.send(msg);
              }
            });
          } catch (ex) {
            socket.send("cant save messaged : " + ex);
          }
          break;
      }
    });
  });
};
