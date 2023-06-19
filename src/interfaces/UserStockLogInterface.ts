import { Schema, Document, model } from 'mongoose';

export default interface IUserStockLog extends Document {
    userId: string;
    stockId: string;
    action: string;
    price: number;
    quantity: number;
    actionDate: Date;
    dateCreated: Date;
    dateUpdated: Date;
}