import { Joi } from 'celebrate';

namespace AddUserStocksPayload {
    export interface Shape {
        stockName: string;
        purchasePrice: number;
        purchaseQuantity: number;
        stockSymbol: string;
        purchaseDate: Date;
        brokerage: string;
    }

    export const schema = Joi.object<Shape>().keys({
        stockName: Joi.string().required(),
        purchasePrice: Joi.number().required(),
        purchaseQuantity: Joi.number().required(),
        stockSymbol: Joi.string().required(),
        purchaseDate: Joi.date().required(),
        brokerage: Joi.string().required(),
    });
}

export default AddUserStocksPayload;
