import mongoose, { Schema, Document } from 'mongoose';
import UserBonds from '../../interfaces/UserBondsInterface';
import IUserBonds from '../../interfaces/UserBondsInterface';

const userBondsSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bondName: {
        type: String,
        required: true,
    },
    faceValue: {
        type: Number,
        required: true,
    },
    couponRate: {
        type: Number,
        required: true,
    },
    maturityDate: {
        type: Date,
        required: true,
    },
    purchaseValue: {
        type: Number,
        required: true,
    },
    paymentFrequency: {
        type: String,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true,
    },
    dateUpdated: {
        type: Date,
        default: Date.now,
        required: true,
    },
    dateDeleted: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const UserBonds = mongoose.model<IUserBonds>('UserBonds', userBondsSchema);

export default UserBonds;
