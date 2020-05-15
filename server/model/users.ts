import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  avatar?: any;
  name: string;
  contacts: IUser[];
}

interface IWrite<T> {
  create: (item: T) => void;
}

const userSchema: Schema = new Schema({
  avatar: { type: Buffer },
  name: { type: String },
  contacts: { type: Array },
  email: { type: String },
});

export const UserModel = mongoose.model<IUser>("Users", userSchema);

export class Worker<T extends Document> implements IWrite<T> {
  private Model: mongoose.Model<Document>;
  private conn: any;
  constructor(model: mongoose.Model<Document>) {
    this.conn = mongoose.connect(
      "mongodb://localhost:27017/chat",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      (err) => {
        if (err) console.log("error on database" + err);
        else {
          console.log("connection to database is ok");
        }
      }
    );
    this.Model = model;
  }

  public create(inUser: Document): Promise<IUser> {
    return new Promise((resolve, reject) => {
      const { email, avatar, name, contacts } = inUser as IUser;
      const user: IUser = {
        email: email,
        avatar: avatar,
        name: name,
        contacts: contacts,
      } as IUser;
      this.Model.create(user, (err: Error, doc: Document) => {
        if (err) {
          console.log("error while saving doc" + err);
          reject(err);
        } else {
          resolve(doc as IUser);
        }
      });
    });
  }

  public async close(): Promise<void> {
    await this.conn.close();
  }
}
