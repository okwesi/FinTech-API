import IUser from "./UserInferface";
import { Request } from "express";

export default interface IAuthenticatedRequest<ReqBody = any> extends Request {
    user?: IUser;
    body: ReqBody;
}