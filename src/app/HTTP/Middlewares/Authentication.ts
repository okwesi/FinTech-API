import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../../Models/User";
import IAuthenticatedRequest from "../../../interfaces/MiddlewareRequestInterface";




const AuthenticationMiddleware = async (req: IAuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | undefined> => {
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }


    const authToken = req.headers.authorization.replace('Bearer ', '');
    if (!authToken) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }
    try {
        const decoded = await jwt.verify(authToken, process.env.SECRET_KEY as string);

        const { id } = decoded as { id: string };
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
}   


export default AuthenticationMiddleware;