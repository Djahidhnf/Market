import { Schema, model, models} from "mongoose";

export interface IAdmin {
  _id: string;
  name: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
);

export default models.Admin || model<IAdmin>("Admin", AdminSchema);