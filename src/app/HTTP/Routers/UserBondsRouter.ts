import { Router } from "express";
import AuthenticationMiddleware from "../Middlewares/Authentication";
import AdminMiddleware from "../Middlewares/AdminMiddleWare";
import UserBondsController from "../Controllers/UserBondsController";
import { Segments, celebrate } from "celebrate";
import AddUserBondsPayload from "../Payloads/AddUserBondsPayload";
import UpdateUserBondsPayload from "../Payloads/UpdateUserBondsPayload";



const UserBondsRouter = Router();


UserBondsRouter.get('/admin', [AuthenticationMiddleware, AdminMiddleware], UserBondsController.adminIndex);
UserBondsRouter.get('/', [AuthenticationMiddleware], UserBondsController.index);
UserBondsRouter.get('/:id', [AuthenticationMiddleware], UserBondsController.show);
UserBondsRouter.post('/', celebrate({ [Segments.BODY]: AddUserBondsPayload.schema }), [AuthenticationMiddleware], UserBondsController.store);
UserBondsRouter.delete('/:id', [AuthenticationMiddleware], UserBondsController.destroy);
UserBondsRouter.put('/:id', celebrate({ [Segments.BODY]: UpdateUserBondsPayload.schema }), [AuthenticationMiddleware], UserBondsController.update);


export default UserBondsRouter;