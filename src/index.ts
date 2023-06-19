import express from 'express';
import mongoose from 'mongoose';
import Router from './Router';
require('dotenv').config();
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Fintech API',
            version: '1.0.0',
            description: 'API documentation for your project',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./src/app/HTTP/Routers/AuthenticationRouter.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server is running on port http://127.0.0.1:${port}`);
    console.log(`Documentation is running on port http://127.0.0.1:${port}/api-docs`);
});
