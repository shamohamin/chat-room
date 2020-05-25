import next from "next";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { socket } from "./socket";
import bodyParser from "body-parser";
import cors from "cors";
import { UserWorker, IUser, UserModel } from "./model/users";
import mongoose from "mongoose";

const dev: boolean = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handel = app.getRequestHandler();
app
  .prepare()
  .then(async () => {
    const server: Express = express();
    server.use(bodyParser.json());
    server.use(express.json());
    server.use(cookieParser());
    server.use(cors());
    await socket();

    server.get(/^\/(?!api).*/, (_req: Request, _res: Response) => {
      return handel(_req, _res);
    });

    server.post("/api/users", async (_req: Request, _res: Response) => {
      const user: IUser = _req.body as IUser;
      console.log(user);
      try {
        await UserWorker.connect();
        let worker: UserWorker<IUser> = new UserWorker<IUser>(UserModel);
        let _user: IUser = await worker.create(user);
        await UserWorker.close();
        console.log(_user);
        _res.status(200).send(_user);
      } catch (ex) {
        _res.status(500).send(`error while saving users : ${ex}`);
      }
    });

    server.get("/api/users/:id", async (_req: Request, _res: Response) => {
      const id = _req.params.id;
      console.log("user with id : " + id);
      try {
        await UserWorker.connect();
        const worker: UserWorker<IUser> = new UserWorker<IUser>(UserModel);
        let _user = await worker.findOne(mongoose.Types.ObjectId(id));
        await UserWorker.close();
        _res.status(200).json(_user);
      } catch (ex) {
        console.log("error not found : " + ex);
        _res.status(404).send(ex);
      }
    });

    server.get("/api/users", async (_req: Request, _res: Response) => {
      console.log("helloooooo");
      try {
        await UserWorker.connect();
        let users = await new UserWorker(UserModel).findAll();
        await UserWorker.close();
        _res.status(200).send(users);
      } catch (ex) {
        _res.status(500).send(ex);
      }
    });

    server.post("/api/login", async (_req: Request, _res: Response) => {
      try {
        const { email } = _req.body ;
        await UserWorker.connect() ;
        let user = (await new UserWorker<IUser>(UserModel).findByEmail(
          email as string
        )) as IUser;
        _res.cookie("user_id", user.id) ;
        await UserWorker.close() ;
        _res.status(200).send(user) ;
      } catch (ex) {
        _res.send(500).send("authenticate failed email not found" + ex);
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
