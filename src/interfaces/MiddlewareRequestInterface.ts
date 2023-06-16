import IUser from "./UserInferface";
import { Request } from "express";

export default  interface IAuthenticatedRequest extends Request {
    user?: IUser;
}