import IUser from "../../../interfaces/UserInferface";

export default interface AuthenticationResource {
    accessToken: string;
    expiryAt: number;
    user: IUser;
}