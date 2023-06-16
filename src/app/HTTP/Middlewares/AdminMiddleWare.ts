import { Response, NextFunction } from 'express';
import Roles from '../../../enums/Roles';
import IAuthenticatedRequest from '../../../interfaces/MiddlewareRequestInterface';

const AdminMiddleware = (req: IAuthenticatedRequest, res: Response, next: NextFunction)  => {
    const user = req.user;
    if (!user || (user.roleId !== Roles.ADMIN)) {
        return res.status(422).json({
            errors: [
                {
                    msg: 'You do not have permissions to do this action.',
                },
            ],
        });
    }

    next();
  
};

export default AdminMiddleware;
