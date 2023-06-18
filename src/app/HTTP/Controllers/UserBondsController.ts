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
        res.status(500).json({ error: 'Server error' });
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
            res.status(404).json({ message: 'User bond not found' });
            return;
        }
        res.status(200).json(userBond);
    } catch (error) {
        console.error('Error retrieving user bond:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const store = async (req: IAuthenticatedRequest<AddUserBondsPayload.Shape>, res: Response): Promise<void> => {
    try {
        const { bondName, faceValue, couponRate, maturityDate, purchaseValue, paymentFrequency, purchaseDate, organization } = req.body;

        if (!Object.values(PaymentFrequency).includes(paymentFrequency)) {
            res.status(400).json({ message: 'Invalid payment frequency' });
            return;
        }

        const userBond = new UserBonds({
            userId: req.user?._id,
            bondName,
            faceValue,
            couponRate,
            maturityDate,
            purchaseValue,
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
        res.status(500).json({ error: 'Server error' });
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
            res.status(404).json({ message: 'User bond not found' });
            return;
        }
        res.status(200).json({ message: 'User bond deleted successfully' });
    } catch (error) {
        console.error('Error deleting user bond:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const update = async (req: IAuthenticatedRequest<UpdateUserBondsPayload.Shape>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { purchaseValue, purchaseDate } = req.body;

        const updatedUserBond = await UserBonds.findOneAndUpdate(
            { _id: id, userId: req.user?._id, isDeleted: { $ne: true } },
            {
                purchaseValue,
                purchaseDate,
                dateUpdated: new Date(),
            },
            { new: true }
        );
        if (!updatedUserBond) {
            res.status(404).json({ message: 'User bond not found or Already deleted' });
            return;
        }
        res.status(200).json(updatedUserBond);
    } catch (error) {
        console.error('Error updating user bond:', error);
        res.status(500).json({ error: 'Server error' });
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