import { Response } from "express";
import IAuthenticatedRequest from "../../../interfaces/MiddlewareRequestInterface";
import UserStocks from "../../Models/UserStocks";
import AddUserStocksPayload from "../Payloads/AddUserStocksPayload";
import ErrorResource from "../Resources/ErrorResource";
import StocksResource from "../Resources/StocksResource";




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
    const userStock = await UserStocks.findOne({ _id: id, userId: user?._id, isDeleted: { $ne: true } }).populate('_id');
    res.status(200).json(userStock);
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

    const userStock = new UserStocks({
        userId: user._id,
        stockName,
        purchasePrice,
        purchaseQuantity,
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


const UserStockController = {
    adminIndex,
    index,
    store,
    destroy,
    show,
    update
}

export default UserStockController;