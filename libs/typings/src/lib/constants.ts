import { IUser } from './models';

export const AUTHORIZER_MICROSERVICE = 'AUTHORIZER_MICROSERVICE';
export const AUTHORIZER_CLIENT_ID = 'authorizer';
export const AUTHORIZER_GROUP_ID = 'authorizer-consumer';
export const jwtConstants = {
  at_secret: 'MySecretPassword',
  rt_secret: 'MySecretPasswordPassword',
  at_expiresIn: '1d',
  rt_expiresIn: '7d',
};

export type JwtPayload = IUser;

export type JwtPayloadWithRt = JwtPayload & { refresh_token: string };
