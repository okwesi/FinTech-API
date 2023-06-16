import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    dateJoined?: Date;
    lastLogin?: Date;
    roleId: number;
    resetToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    expiresAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}

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
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    roleId: {
        type: Number,
        required: true,
    },
    resetToken: {
        type: String,
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
