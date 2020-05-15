import WebSocket from "ws";

export const socket: () => void = () => {
  const webSocket = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Websocket Server stablished !!!!!!!");
  });

  webSocket.on("connection", (socket: WebSocket): void => {
    console.log("everyThing is fine and connection is Stablished !!!!!!");

    socket.on("message", (inMsg: string) => {
        console.log(inMsg)
    });
  });
};
