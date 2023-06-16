import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import SignUpPayload from '../Payloads/SignUpPayload';
import AuthenticationController from '../Controllers/AuthenticationController';
import SignInPayload from '../Payloads/SignInPayload';

const AuthenticationRouter = Router();

AuthenticationRouter.post('/signup', celebrate({ [Segments.BODY]: SignUpPayload.schema }), AuthenticationController.signup);
AuthenticationRouter.post('/signin', celebrate({ [Segments.BODY]: SignInPayload.schema }), AuthenticationController.signin);


export default AuthenticationRouter;