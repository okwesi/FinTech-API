import { Request, Response } from 'express';
import User from '../../Models/User';
import SignUpPayload from '../Payloads/SignUpPayload';
import Roles from '../../../enums/Roles';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SignInPayload from '../Payloads/SignInPayload';
require('dotenv').config();

// Validation



const signup = async (request: Request<{}, {}, SignUpPayload.shape>, response: Response) => {

    const { username, email, password } = request.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
        return response.status(400).json('User with email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username: username,
        email: email,
        password: hashPassword,
        roleId: Roles.USER,
    });

    try {
        const savedUser = await user.save();
        response.json({ user_id: savedUser._id });
    } catch (err) {
        response.status(400).json(err);
    }
};


 const signin = async (req: Request<{}, {}, SignInPayload.shape>, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json('Invalid credentials.');
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json("User with this email does not exist");
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json("Password is not correct");
            return;
        }
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 2);

        user.expiresAt = expirationDate;
        user.lastLogin = new Date();
        await user.save();


        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "");
        res.header("Authorization", token).json(token);

    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const AuthenticationController = {
    signup,
    signin,
};

export default AuthenticationController;