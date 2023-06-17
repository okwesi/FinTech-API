import { Joi } from 'celebrate';

namespace UpdateUserBondsPayload {
    export interface Shape {
        purchaseValue: number;
        purchaseDate: Date;
    }

    export const schema = Joi.object<Shape>().keys({
        purchaseValue: Joi.number(),
        purchaseDate: Joi.date(),
    });
}

export default UpdateUserBondsPayload;
