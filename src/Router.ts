import express from 'express';
import { celebrate, Segments } from 'celebrate';
import AuthenticationRouter from './app/HTTP/Routers/AuthenticationRouter';
import UserStocksRouter from './app/HTTP/Routers/UserStocksRouter';

const Router = express();

Router.use('/auth', AuthenticationRouter);
Router.use('/user-stocks', UserStocksRouter);


export default Router;