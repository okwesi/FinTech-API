import { Router } from 'express';
import UserStockController from "../Controllers/UserStockController";
import AuthenticationMiddleware from "../Middlewares/Authentication";
import { Segments, celebrate } from "celebrate";
import User from '../../Models/User';
import AddUserStocksPayload from '../Payloads/AddUserStocksPayload';
import AdminMiddleware from '../Middlewares/AdminMiddleWare';
import UpdateUserStockPayload from '../Payloads/UpdateUserStockPayload';

const UserStocksRouter = Router();

UserStocksRouter.get('/admin', [AuthenticationMiddleware, AdminMiddleware], UserStockController.adminIndex);
UserStocksRouter.get('/', [AuthenticationMiddleware], UserStockController.index);
UserStocksRouter.get('/:id', [AuthenticationMiddleware], UserStockController.show);
UserStocksRouter.post('/', celebrate({ [Segments.BODY]: AddUserStocksPayload.schema }) , [AuthenticationMiddleware], UserStockController.store);
UserStocksRouter.delete('/:id', [AuthenticationMiddleware], UserStockController.destroy);
UserStocksRouter.put('/:id', celebrate({ [Segments.BODY]: UpdateUserStockPayload.schema }), [AuthenticationMiddleware], UserStockController.update);



export default UserStocksRouter;