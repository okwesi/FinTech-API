import IUser from "./UserInferface";
import { Request } from 'express';
import { ParsedQs } from 'qs';

export default interface IAuthenticatedRequest<ReqBody = any, QueryParams = ParsedQs>
    extends Request<Record<string, any>, any, any, QueryParams> {
    user?: IUser;
    body: ReqBody;
}

