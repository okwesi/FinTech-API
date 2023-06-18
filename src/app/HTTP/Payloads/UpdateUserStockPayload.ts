import { Joi } from 'celebrate';

namespace UpdateUserStockPayload {
    export interface Shape {
        id: string;
        stockName: string | null;
        purchaseQuantity: number | null;
    }

    export const schema = Joi.object<Shape>().keys({
        id: Joi.string(),
        stockName: Joi.string().allow(null),
        purchaseQuantity: Joi.number().allow(null),
    });
}

export default UpdateUserStockPayload;
