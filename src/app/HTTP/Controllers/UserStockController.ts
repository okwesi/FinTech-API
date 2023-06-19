import { Response } from "express";
import IAuthenticatedRequest from "../../../interfaces/MiddlewareRequestInterface";
import UserStocks from "../../Models/UserStocks";
import AddUserStocksPayload from "../Payloads/AddUserStocksPayload";
import ErrorResource from "../Resources/ErrorResource";
import StocksResource from "../Resources/StocksResource";
import UserStockLog from "../../Models/UserStockLog";
import AddUserStockLogPayload from "../Payloads/AddUserStockLogPayload";
import { StockData, StockResource } from "../Resources/StockResource";
import UserStockLogResource from "../Resources/UserStockLogResources";
import axios from "axios";



const adminIndex = async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const userStocks = await UserStocks.find({}).populate({
        path: 'userId',
        select: '-password'
    });
    res.status(200).json(userStocks);
}


const index = async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const totalStocks = await UserStocks.countDocuments({
            userId: user?._id,
            isDeleted: { $ne: true },
        });

        const userStocks = await UserStocks.find({ userId: user?._id, isDeleted: { $ne: true } })
            .sort({ dateCreated: 'asc' })
            .skip(startIndex)
            .limit(limit)
            .populate('_id');

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalStocks / limit),
            totalItems: totalStocks,
        };

        const stockResource: StocksResource = {
            pagination: pagination,
            stocks: userStocks
        };

        res.status(200).json(stockResource);
    } catch (err: any) {
        const errorResponse: ErrorResource = {
            data: null,
            error: {
                status: 400,
                message: err.message
            }
        };

        res.status(400).json(errorResponse);
    };
};

const show = async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const { id } = req.params;

    try {
        const userStock = await UserStocks.findOne({ _id: id, userId: user?._id, isDeleted: { $ne: true } }).populate('_id');
        if (!userStock) {
            return res.status(404).json({
                message: 'User stock not found'
            });
        }

        const userStockLogs = await UserStockLog.find({ stockId: userStock._id });

        const stockLogResource: UserStockLogResource[] =  userStockLogs.map((userStockLog) => {
            return {
                action: userStockLog.action,
                price: userStockLog.price,
                quantity: userStockLog.quantity,
                actionDate: userStockLog.actionDate,
                dateCreated: userStockLog.dateCreated,
                dateUpdated: userStockLog.dateUpdated,
            };
        });

        
        const stockResource: StockResource = {
            _id: userStock._id,
            stockName: userStock.stockName,
            dateCreated: userStock.dateCreated,
            dateUpdated: userStock.dateUpdated,
            dateDeleted: userStock.dateDeleted,
            isDeleted: userStock.isDeleted,
            purchasePrice: userStock.purchasePrice,
            purchaseQuantity: userStock.purchaseQuantity,
            currentQuantity: userStock.currentQuantity,
            stockSymbol: userStock.stockSymbol,
            purchaseDate: userStock.purchaseDate,
            brokerage: userStock.brokerage,
            stockLog: stockLogResource,
            stockData: null,
        };
        const options = {
            method: 'GET',
            url: 'https://alpha-vantage.p.rapidapi.com/query',
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: userStock.stockSymbol,
                datatype: 'json'
            },
            headers: {
                'X-RapidAPI-Key': '2c71ad3c52msh0b77d95cfe8c66ap15d1fbjsn03787be01f6b',
                'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const stockData = response.data['Global Quote'] || {}; 

            stockResource.stockData = {
                symbol: stockData['01. symbol'],
                open: stockData['02. open'],
                high: stockData['03. high'],
                low: stockData['04. low'],
                price: stockData['05. price'],
                volume: stockData['06. volume'],
                latestTradingDay: stockData['07. latest trading day'],
                previousClose: stockData['08. previous close'],
                change: stockData['09. change'],
                changePercent: stockData['10. change percent'],
            };

            res.status(200).json(stockResource);
            return;
        } catch (error) {
            console.error('Error retrieving stock data:', error);
        }
        
        res.status(200).json(stockResource);
    } catch (error) {
        console.error('Error retrieving user stock:', error);
        res.status(500).json({ error: 'Server error' });
    }
}






const store = async (req: IAuthenticatedRequest<AddUserStocksPayload.Shape>, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const { stockName,
        purchasePrice,
        purchaseQuantity,
        stockSymbol,
        purchaseDate,
        brokerage } = req.body;
    const currentQuantity = purchaseQuantity;
    const userStock = new UserStocks({
        userId: user._id,
        stockName,
        purchasePrice,
        purchaseQuantity,
        currentQuantity,
        stockSymbol,
        purchaseDate,
        brokerage,
        dateCreated: new Date(),
        dateUpdated: new Date(),
    });
    try {
        const savedUserStock = await userStock.save();
        res.status(200).json(savedUserStock);
    } catch (err) {
        res.status(400).json(err);
    }
}

const destroy = async (req: IAuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const { id } = req.params;
    try {
        const deletedUserStock = await UserStocks.findOneAndUpdate(
            { _id: id, userId: req.user?._id },
            {
                isDeleted: true,
                dateDeleted: new Date()
            },
            { new: true }

        );
        if (!deletedUserStock) {
            return res.status(404).json({
                message: 'Unauthorized to delete'
            });
        }
        res.status(200).json({
            "message": "Stock Deleted Successfully"
        });
    } catch (err) {
        res.status(400).json(err);
    }
}


const update = async (req: IAuthenticatedRequest<AddUserStocksPayload.Shape>, res: Response) => {
    console.log('update');
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    const { id } = req.params;
    const {
        stockName,
        purchaseQuantity
    } = req.body;

    try {
        const updatedUserStock = await UserStocks.findOneAndUpdate(
            { _id: id, userId: req.user?._id, isDeleted: { $ne: true } },
            {
                stockName,
                purchaseQuantity,
                dateUpdated: new Date()
            },
            { new: true }
        );
        if (!updatedUserStock) {
            return res.status(404).json({
                message: 'Unauthorized to update'
            });
        }
        res.status(200).json(updatedUserStock);
    } catch (err) {
        res.status(400).json(err);
    }
}


//TODO: Update the model to include current price to the database and the log table
const transaction = async (req: IAuthenticatedRequest<AddUserStockLogPayload.Shape>, res: Response) => {
    console.log('transaction');
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    const { id } = req.params;
    const { action, quantity, actionDate, price } = req.body;

    try {
        const userStock = await UserStocks.findOne({ _id: id, userId: req.user?._id, isDeleted: { $ne: true } });
        if (!userStock) {
            return res.status(404).json({
                message: 'User stock not found',
            });
        }


        let currentQuantity = userStock.currentQuantity;

        if (action === 'Bought') {
            currentQuantity += quantity; 
        } else if (action === 'Sold') {
            currentQuantity +- quantity; 
        } else {
            return res.status(400).json({
                message: 'Invalid action',
            });
        }

        const userStockLog = new UserStockLog({
            userId: req.user?._id,
            stockId: id,
            action: action,
            price: price, 
            quantity: quantity,
            actionDate: actionDate,
            dateCreated: new Date(),
            dateUpdated: new Date(),
        });

        const savedUserStockLog = await userStockLog.save();

        const updatedUserStock = await UserStocks.findOneAndUpdate(
            { _id: id, userId: req.user?._id, isDeleted: { $ne: true } },
            {
                currentQuantity: currentQuantity,
                dateUpdated: new Date(),
            },
            { new: true }
        );

        if (!updatedUserStock) {
            return res.status(404).json({
                message: 'Unauthorized to update',
            });
        }

        res.status(200).json(updatedUserStock);
    } catch (err) {
        res.status(400).json(err);
    }
};

const UserStockController = {
    adminIndex,
    index,
    store,
    destroy,
    show,
    update,
    transaction
}

export default UserStockController;