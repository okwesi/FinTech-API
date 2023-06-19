import { Joi } from 'celebrate';

namespace AddUserStockLogPayload {
    export interface Shape {
        action: string;
        price: number;
        quantity: number;
        actionDate: Date;
    }

    export const schema = Joi.object<Shape>().keys({
        action: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        actionDate: Joi.date().required(),
       
    });
}

export default AddUserStockLogPayload;
