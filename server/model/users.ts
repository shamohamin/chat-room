import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  body: string | Buffer;
  to?: any;
  from?: any;
}

export interface IUser extends Document {
  email: string;
  avatar?: any;
  name: string;
  contacts: IUser[];
  messages: IMessage[];
}

interface IRead {
  findOne: (ID: any) => Promise<any>;
  findAll: () => Promise<any>;
}

interface IWrite<T extends Document> {
  create: (item: T) => Promise<any>;
  sendMessage: (item: T, userID: mongoose.Types.ObjectId) => Promise<any>;
}

const userSchema: Schema = new Schema({
  avatar: { type: Buffer },
  name: { type: String },
  contacts: { type: Array },
  email: { type: String },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

const messageShema: Schema = new Schema({
  body: { type: String },
  to: { type: mongoose.Types.ObjectId, ref: "Users" },
});

export const UserModel = mongoose.model<IUser>("Users", userSchema);
export const MessageModel = mongoose.model<IMessage>("Message", messageShema);

export class UserWorker<T extends Document> implements IWrite<T>, IRead {
  private Model: mongoose.Model<Document>;
  private static conn: mongoose.Connection | undefined;
  constructor(model: mongoose.Model<Document>) {
    this.Model = model;
  }

  public static async connect() {
    await mongoose.connect(
      "mongodb://localhost:27017/chat",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      (err) => {
        if (err) {
          console.log("error on database" + err);
          throw `Can't connect to Database with error: ${err}`;
        } else {
          console.log("connection to database is ok");
        }
      }
    );
    UserWorker.conn = mongoose.connection;
  }

  public create(inUser: Document): Promise<IUser> {
    return new Promise((resolve, reject) => {
      let user: IUser;
      const { email, avatar, name, contacts } = inUser as IUser;
      user = {
        email: email,
        avatar: avatar,
        name: name,
        contacts: contacts,
      } as IUser;
      this.Model.create(user, (err: Error | null, doc: Document) => {
        if (err) {
          console.log("error while saving doc" + err);
          reject(err);
        } else {
          let res = <Document>doc;
          resolve(res as IUser);
        }
      });
    });
  }

  public async sendMessage(
    inMessage: Document,
    userID: mongoose.Types.ObjectId
  ): Promise<void> {
    let user = await this.findOne(userID);
    user.messages.push(inMessage as IMessage);
    await user.save();
  }

  public findOne(ID: any): Promise<IUser> {
    return new Promise((resolve, rejects) => {
      this.Model.findOne({ _id: ID })
        .populate("messages")
        .exec((err: Error | null, doc: Document) => {
          if (err) {
            console.log("error while find one ");
            rejects(err);
          } else {
            resolve(doc as IUser);
          }
        });
    });
  }

  public findByEmail(email: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      this.Model.findOne({ email })
        .populate("messages")
        .exec((err: Error | null, doc: Document) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(doc as IUser);
          }
        });
    });
  }

  public async findAll(): Promise<T[]> {
    return new Promise((resolve, rejects) => {
      this.Model.find({}, (err: Error, docs: T[]) => {
        if (err) rejects(err);
        else {
          resolve(docs);
        }
      });
    });
  }

  public static async close(): Promise<void> {
    if (UserWorker.conn) await UserWorker.conn.close();
  }
}
