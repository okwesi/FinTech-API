import { Joi } from 'celebrate';

namespace SignUpPayload {
    export interface shape {
        username: string;
        email: string;
        password: string;
    }

    export const schema = Joi.object<shape>().keys({
        username: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(2).max(255).trim().required(),
        });
}

export default SignUpPayload;
