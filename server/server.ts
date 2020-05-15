import next from "next";
import express, { Express, Request, Response } from "express";
import { socket } from "./socket";
import bodyParser from "body-parser";
import cors from "cors";
import { Worker, IUser, UserModel } from "./model/users";

const dev: boolean = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handel = app.getRequestHandler();
app
  .prepare()
  .then((): any => {
    const server: Express = express();
    server.use(bodyParser.json());
    server.use(express.json());
    server.use(cors());
    socket();

    server.get("*", (_req: Request, _res: Response) => {
      return handel(_req, _res);
    });

    server.post("/api/users", async (_req: Request, _res: Response) => {
      const user: IUser = _req.body as IUser;
      console.log("body :" + _req.body);
      console.log(user);
      console.log("hello inside endpoint");
      try {
        let worker:Worker<IUser> = new Worker<IUser>(UserModel);
        let _user: IUser = await worker.create(user);
        await worker.close();
        console.log(_user);
        _res.status(200).send(_user);
      } catch (ex) {
        _res.status(500).send("error while saving users");
      }
    });

    server.listen(3000, (err: Error) => {
      if (err) throw new Error("bad request " + err);
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  });
