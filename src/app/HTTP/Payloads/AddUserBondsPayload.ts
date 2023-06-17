import { Joi } from 'celebrate';

namespace AddUserBondsPayload {
    export interface Shape {
        bondName: string;
        faceValue: number;
        couponRate: number;
        maturityDate: Date;
        purchaseValue: number;
        paymentFrequency: string;
        purchaseDate: Date;
        organization: string;
    }

    export const schema = Joi.object<Shape>().keys({
        bondName: Joi.string().required(),
        faceValue: Joi.number().required(),
        couponRate: Joi.number().required(),
        maturityDate: Joi.date().required(),
        purchaseValue: Joi.number(),
        paymentFrequency: Joi.string().required(),
        purchaseDate: Joi.date(),
        organization: Joi.string().required(),
    });
}

export default AddUserBondsPayload;
