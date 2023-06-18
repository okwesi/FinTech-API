import { Joi } from 'celebrate';

namespace UpdateUserBondsPayload {
    export interface Shape {
        id: string;
        bondName: string | null;
        purchaseValue: number | null;
        purchaseDate: string | null;
    }
    export const schema = Joi.object<Shape>().keys({
        id: Joi.string(),
        bondName: Joi.string().allow(null),
        purchaseValue: Joi.number().allow(null),
        purchaseDate: Joi.string().allow(null),
    });
}

export default UpdateUserBondsPayload;
