import mongoose, { Schema, Document } from 'mongoose';

export default interface IUserStock extends Document {
    userId: string;
    stockName: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    isDeleted: boolean;
    purchasePrice: number;
    purchaseQuantity: number;
    stockSymbol: string;
    purchaseDate: Date;
    brokerage: string;
}