import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (data: keyof any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request?.get('authorization')?.replace('Bearer', '').trim();
  }
);
