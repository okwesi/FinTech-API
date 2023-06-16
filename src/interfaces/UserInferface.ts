import mongoose, { Schema, Document } from 'mongoose';

export default  interface IUser extends Document {
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
