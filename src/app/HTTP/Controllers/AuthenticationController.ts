import { Request, Response, response } from 'express';
import User from '../../Models/User';
import SignUpPayload from '../Payloads/SignUpPayload';
import Roles from '../../../enums/Roles';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SignInPayload from '../Payloads/SignInPayload';
import AuthenticationResponse from '../Resources/AuthenticationResource';
import IAuthenticatedRequest from '../../../interfaces/MiddlewareRequestInterface';
import { OkResource } from '../Resources/OkResource';
import ErrorResource from '../Resources/ErrorResource';
require('dotenv').config();


const signup = async (request: Request<{}, {}, SignUpPayload.shape>, response: Response) => {

    const { username, email, password } = request.body;
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            const errorResponse: ErrorResource = {
                data: null,
                error: {
                    status: 400,
                    message: 'User with email already exists'
                }
            };
            response.status(400).json(errorResponse);
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username: username,
            email: email,
            password: hashPassword,
            roleId: Roles.USER,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: new Date(),
        });

        const savedUser = await user.save();


        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET || "");

        const authResponse: AuthenticationResponse = {
            accessToken: token,
            expiryAt: Number(savedUser.expiresAt?.getTime()),
            user: savedUser
        };

        response.json(authResponse);
       
    } catch (err: any) {
        const errorResponse: ErrorResource = {
            data: null,
            error: {
                status: 400,
                message: err.message
            }
        };

        response.status(400).json(errorResponse);
    }
};



const signin = async (req: Request<{}, {}, SignInPayload.shape>, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {

            const errorResponse: ErrorResource = {
                data: null,
                error: {
                    status: 400,
                    message: 'Invalid credentials.'
                }
            };
            res.status(400).json(errorResponse);
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {

            const errorResponse: ErrorResource = {
                data: null,
                error: {
                    status: 400,
                    message: "Invalid Credentials"
                }
            };
            res.status(400).json(errorResponse);
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {

            const errorResponse: ErrorResource = {
                data: null,
                error: {
                    status: 400,
                    message: "Invalid Credentials"
                }
            };
            res.status(400).json(errorResponse);
            return;
        }
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 2);

        user.expiresAt = expirationDate;
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "");

        const response: AuthenticationResponse = {
            accessToken: token,
            expiryAt: Number(expirationDate.getTime()),
            user: user
        };

        res.json(response);

    } catch (err: any) {
        const errorResponse: ErrorResource = {
            data: null,
            error: {
                status: 400,
                message: err.message
            }
        };

        response.status(400).json(errorResponse);
    }
};


const signout = async (req: IAuthenticatedRequest, res: Response): Promise<Response | undefined> => {
    try {

        const updatedUserBond = await User.findOneAndUpdate(
            { userId: req.user?._id },
            {
                expiresAt: '',
            }
        );
        const response: OkResource = {
            status: 200,
            message: 'ok',
        };

        return res.status(200).json(response);
    } catch (err: any) {
        const errorResponse: ErrorResource = {
            data: null,
            error: {
                status: 400,
                message: err.message
            }
        };

        response.status(400).json(errorResponse);
    }
};

const AuthenticationController = {
    signup,
    signin,
    signout,
};

export default AuthenticationController;