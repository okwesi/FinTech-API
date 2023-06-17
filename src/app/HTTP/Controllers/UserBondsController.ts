import { Response } from 'express';
import UserBonds from '../../Models/UserBonds';
import IAuthenticatedRequest from '../../../interfaces/MiddlewareRequestInterface';
import AddUserBondsPayload from '../Payloads/AddUserBondsPayload';
import UpdateUserBondsPayload from '../Payloads/UpdateUserBondsPayload';
import PaymentFrequency from '../../../enums/PayementFrequency';

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
        const userBonds = await UserBonds.find({ userId: req.user?._id, isDeleted: { $ne: true } });
        res.status(200).json(userBonds);
    } catch (error) {
        console.error('Error retrieving user bonds:', error);
        res.status(500).json({ error: 'Server error' });
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