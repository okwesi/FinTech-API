import mongoose, { Schema, Document } from 'mongoose';


export default interface IUserBonds extends Document {
    userId: string;
    bondName: string;
    faceValue: number;
    couponRate: number;
    maturityDate: Date;
    purchaseValue: number;
    paymentFrequency: string;
    purchaseDate: Date;
    organization: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    isDeleted: boolean;
}