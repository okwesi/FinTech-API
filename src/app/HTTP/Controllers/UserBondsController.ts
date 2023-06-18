import { Response } from 'express';
import UserBonds from '../../Models/UserBonds';
import IAuthenticatedRequest from '../../../interfaces/MiddlewareRequestInterface';
import AddUserBondsPayload from '../Payloads/AddUserBondsPayload';
import UpdateUserBondsPayload from '../Payloads/UpdateUserBondsPayload';
import PaymentFrequency from '../../../enums/PayementFrequency';
import Pagination from '../../../interfaces/PaginationInterface';
import ErrorResource, { ErrorPayload } from '../Resources/ErrorResource';
import BondsResource from '../Resources/BondsResources';

const adminIndex = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userBonds = await UserBonds.find({});
        res.status(200).json(userBonds);
    } catch (error) {
        console.error('Error retrieving user bonds:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};

const index = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const totalBonds = await UserBonds.countDocuments({ userId: req.user?._id, isDeleted: { $ne: true } });

        const userBonds = await UserBonds.find({ userId: req.user?._id, isDeleted: { $ne: true } })
            .sort({ maturityDate: 'asc' })
            .skip(startIndex)
            .limit(limit);

        const pagination: Pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalBonds / limit),
            totalItems: totalBonds
        };

        const bondsResource: BondsResource = {
            bonds: userBonds,
            pagination: pagination,
        };

        res.status(200).json(bondsResource);
    } catch (error) {
        console.error('Error retrieving user bonds:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};

const show = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userBond = await UserBonds.findOne({ _id: id, userId: req.user?._id, isDeleted: { $ne: true } });
        if (!userBond) {
            const errorPayload: ErrorPayload = {
                status: 404,
                message: 'User bond not found',
            };
            const errorResource: ErrorResource = {
                data: null,
                error: errorPayload,
            };
            res.status(404).json(errorResource);
            return;
        }
        res.status(200).json(userBond);
    } catch (error) {
        console.error('Error retrieving user bond:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};

const store = async (req: IAuthenticatedRequest<AddUserBondsPayload.Shape>, res: Response): Promise<void> => {
    try {
        const { bondName, faceValue, couponRate, maturityDate, purchaseValue, paymentFrequency, purchaseDate, organization } = req.body;

        if (!Object.values(PaymentFrequency).includes(paymentFrequency)) {
            const errorPayload: ErrorPayload = {
                status: 400,
                message: 'Invalid payment frequency',
            };
            const errorResource: ErrorResource = {
                data: null,
                error: errorPayload,
            };
            res.status(400).json(errorResource);
            return;
        }

        const existingBond = await UserBonds.findOne({ bondName, userId: req.user?._id });
        if (existingBond) {
            const errorPayload: ErrorPayload = {
                status: 400,
                message: 'Bond name already exists',
            };
            const errorResource: ErrorResource = {
                data: null,
                error: errorPayload,
            };
            res.status(400).json(errorResource);
            return;
        }

        const computedPurchaseValue = purchaseValue || faceValue;

        const userBond = new UserBonds({
            userId: req.user?._id,
            bondName,
            faceValue,
            couponRate,
            maturityDate,
            purchaseValue: computedPurchaseValue,
            paymentFrequency,
            purchaseDate,
            organization,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            dateDeleted: null,
            isDeleted: false,
        });

        const savedUserBond = await userBond.save();
        res.status(200).json(savedUserBond);
    } catch (error) {
        console.error('Error creating user bond:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};

const destroy = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUserBond = await UserBonds.findOneAndUpdate(
            { _id: id, userId: req.user?._id },
            { isDeleted: true, dateDeleted: new Date() },
            { new: true }
        );
        if (!deletedUserBond) {
            const errorPayload: ErrorPayload = {
                status: 404,
                message: 'User bond not found',
            };
            const errorResource: ErrorResource = {
                data: null,
                error: errorPayload,
            };
            res.status(404).json(errorResource);
            return;
        }
        res.status(200).json({ message: 'User bond deleted successfully' });
    } catch (error) {
        console.error('Error deleting user bond:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};

const update = async (req: IAuthenticatedRequest<UpdateUserBondsPayload.Shape>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { purchaseValue, purchaseDate, bondName } = req.body;

        const updateFields: any = {
            dateUpdated: new Date(),
        };

        if (bondName !== null) {
            updateFields.bondName = bondName;
        }

        if (purchaseValue !== null) {
            updateFields.purchaseValue = purchaseValue;
        }

        if (purchaseDate !== null) {
            updateFields.purchaseDate = purchaseDate;
        }

        const updatedUserBond = await UserBonds.findOneAndUpdate(
            { _id: id, userId: req.user?._id, isDeleted: { $ne: true } },
            updateFields,
            { new: true }
        );

        if (!updatedUserBond) {
            const errorPayload: ErrorPayload = {
                status: 404,
                message: 'User bond not found or already deleted',
            };
            const errorResource: ErrorResource = {
                data: null,
                error: errorPayload,
            };
            res.status(404).json(errorResource);
            return;
        }

        res.status(200).json(updatedUserBond);
    } catch (error) {
        console.error('Error updating user bond:', error);
        const errorPayload: ErrorPayload = {
            status: 500,
            message: 'Server error',
        };
        const errorResource: ErrorResource = {
            data: null,
            error: errorPayload,
        };
        res.status(500).json(errorResource);
    }
};


const UserBondsController = {
    adminIndex,
    index,
    show,
    store,
    destroy,
    update,
};

export default UserBondsController;
