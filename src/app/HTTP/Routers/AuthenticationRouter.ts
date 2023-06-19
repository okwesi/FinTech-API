import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import SignUpPayload from '../Payloads/SignUpPayload';
import AuthenticationController from '../Controllers/AuthenticationController';
import SignInPayload from '../Payloads/SignInPayload';
import User from '../../Models/User';

const AuthenticationRouter = Router();

/**
 * @swagger
 * baseUri: /
 * /api/v1/auth/signup:
 *   post:
 *     summary: User Signup
 *     description: Creates a new user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Signup payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpPayload'
 *     responses:
 *       200:
 *         description: User account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignUpResponse'
 *       400:
 *         description: Invalid request payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 */
AuthenticationRouter.post('/signup', celebrate({ [Segments.BODY]: SignUpPayload.schema }), AuthenticationController.signup);


/**
 * @swagger
 * baseUri: /
 * /api/v1/auth/signin:
 *   post:
 *     summary: User Signin
 *     description: Authenticates a user and returns an access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: Signin payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInPayload'
 *     responses:
 *       200:
 *         description: User authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       400:
 *         description: Invalid credentials or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 */
AuthenticationRouter.post('/signin', celebrate({ [Segments.BODY]: SignInPayload.schema }), AuthenticationController.signin);


/**
 * @swagger
 * baseUri: 
 * /api/v1/auth/signout:
 *   post:
 *     summary: User Signout
 *     description: Invalidates the user's access token.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User signout successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OkResource'
 *       400:
 *         description: Invalid request or error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResource'
 *       500:
 *         description: Internal server error.
 */

AuthenticationRouter.post('/signout', celebrate({ [Segments.BODY]: SignInPayload.schema }), AuthenticationController.signin);


/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpPayload:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         email:
 *           type: string
 *           format: email
 *           minLength: 6
 *           maxLength: 255
 *         password:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
  *     SignInPayload:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           minLength: 6
 *           maxLength: 255
 *         password:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *       required:
 *         - email
 *         - password
 *     SignUpResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         expiryAt:
 *           type: number
 *         user:
 *           $ref: '#/components/schemas/User'
 *     OkResource:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: null
 *         error:
 *           $ref: '#/components/schemas/ErrorObject'
 *     ErrorObject:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *         message:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         age:
 *           type: number
 *         address:
 *           type: string
 *       required:
 *         - username
 *         - email
 *         - password
 */


export default AuthenticationRouter;