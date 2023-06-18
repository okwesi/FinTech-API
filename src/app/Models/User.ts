import mongoose, { Schema, Document } from 'mongoose';
import IUser from '../../interfaces/UserInferface';


const userSchema: Schema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    roleId: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
});

export default mongoose.model<IUser>('User', userSchema);
