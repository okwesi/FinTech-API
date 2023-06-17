import { Joi } from 'celebrate';

namespace UpdateUserStockPayload {
    export interface Shape {
        stockName: string;
        purchaseQuantity: number;
    }

    export const schema = Joi.object<Shape>().keys({
        stockName: Joi.string(),
        purchaseQuantity: Joi.number().required(),
    });
}

export default UpdateUserStockPayload;
