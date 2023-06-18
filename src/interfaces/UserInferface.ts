import mongoose, { Schema, Document } from 'mongoose';

export default  interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    lastLogin?: Date;
    roleId: number;
    createdAt?: Date;
    updatedAt?: Date;
    expiresAt?: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}
