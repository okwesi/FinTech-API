import express from 'express';
import { celebrate, Segments } from 'celebrate';
import AuthenticationRouter from './app/HTTP/Routers/AuthenticationRouter';
import UserStocksRouter from './app/HTTP/Routers/UserStocksRouter';
import UserBondsRouter from './app/HTTP/Routers/UserBondsRouter';

const Router = express();

Router.use('/auth', AuthenticationRouter);
Router.use('/user-stocks', UserStocksRouter);
Router.use('/user-bonds', UserBondsRouter);


export default Router;