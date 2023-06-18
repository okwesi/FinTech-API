import express from 'express';
import { celebrate, Segments } from 'celebrate';
import AuthenticationRouter from './app/HTTP/Routers/AuthenticationRouter';
import UserStocksRouter from './app/HTTP/Routers/UserStocksRouter';
import UserBondsRouter from './app/HTTP/Routers/UserBondsRouter';

const Router = express();
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpPayload'
 *     responses:
 *       200:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResource'
 */
Router.use('/auth', AuthenticationRouter);



Router.use('/user-stocks', UserStocksRouter);
Router.use('/user-bonds', UserBondsRouter);


export default Router;