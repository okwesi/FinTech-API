import { Schema, Document, model } from 'mongoose';
import IUserStockLog from '../../interfaces/UserStockLogInterface';


const UserStockLogSchema = new Schema<IUserStockLog>(
    {
        userId: {
            type: String,
            required: true,
        },
        stockId: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        }, 
        quantity: {
            type: Number,
            required: true,
        },
        actionDate: {
            type: Date,
            required: true,
        },
        dateCreated: {
            type: Date,
            default: Date.now,
        },
        dateUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { versionKey: false }
);

const UserStockLog = model<IUserStockLog>('UserStockLog', UserStockLogSchema);

export default UserStockLog;
