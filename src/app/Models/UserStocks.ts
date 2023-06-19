import mongoose, { Schema, Document } from 'mongoose';
import IUserStock from '../../interfaces/UserStockInterface';

const UserStockSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stockName: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateUpdated: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateDeleted: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    purchaseQuantity: {
        type: Number,
        required: true
    },
    currentQuantity: {
        type: Number,
        required: true
    },
    stockSymbol: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    brokerage: {
        type: String,
        required: true
    }
});

const UserStockModel = mongoose.model<IUserStock>('StockPurchase', UserStockSchema);

export default UserStockModel;
