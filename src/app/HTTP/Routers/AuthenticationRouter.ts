import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import SignUpPayload from '../Payloads/SignUpPayload';
import AuthenticationController from '../Controllers/AuthenticationController';
import SignInPayload from '../Payloads/SignInPayload';

const AuthenticationRouter = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *      
 *     responses:
 *       200:
 *         description: Signup successful
 *                   
 *       400:
 *         description: Bad request or user already exists
 *        
 */
AuthenticationRouter.post('/signup', celebrate({ [Segments.BODY]: SignUpPayload.schema }), AuthenticationController.signup);




AuthenticationRouter.post('/signin', celebrate({ [Segments.BODY]: SignInPayload.schema }), AuthenticationController.signin);
AuthenticationRouter.post('/signout', celebrate({ [Segments.BODY]: SignInPayload.schema }),  AuthenticationController.signin);


export default AuthenticationRouter;