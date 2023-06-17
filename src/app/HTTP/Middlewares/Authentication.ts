import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../../Models/User";
import IAuthenticatedRequest from "../../../interfaces/MiddlewareRequestInterface";
require('dotenv').config();



const AuthenticationMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    try {
        const authToken = req.headers.authorization.replace('Bearer ', '');
        if (!authToken) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }
        const decoded = await jwt.verify(authToken, process.env.JWT_SECRET || "");
        const { _id } = decoded as any;
        const user = await User.findById(_id);
        
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized Here'
        });
    }
}   


export default AuthenticationMiddleware;