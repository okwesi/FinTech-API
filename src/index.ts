import express from 'express';
import mongoose from 'mongoose';
import Router from './Router';
require('dotenv').config();
import cors from 'cors';



const app = express();
app.use(express.json());
const port = process.env.PORT;

app.use(cors({ origin: '*' }));
mongoose.connect(process.env.MONGO_URL || "")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.use('/api/v1', Router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
