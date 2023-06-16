import express from 'express';
import { celebrate, Segments } from 'celebrate';
import AuthenticationRouter from './app/HTTP/Routers/AuthenticationRouter';

const Router = express();

Router.use('/auth', AuthenticationRouter);


export default Router;