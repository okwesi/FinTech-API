import { Joi } from 'celebrate';

namespace SignInPayload {
    export interface shape {
        email: string;
        password: string;
    }

    export const schema = Joi.object<shape>().keys({
        email: Joi.string().email().lowercase().trim().required().example('john.doe@example.com'),
        password: Joi.string().trim().required(),
    });
}

export default SignInPayload;
