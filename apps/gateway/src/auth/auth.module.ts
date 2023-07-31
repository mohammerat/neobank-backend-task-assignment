import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

import {
  AUTHORIZER_GROUP_ID,
  AUTHORIZER_MICROSERVICE,
  AtStrategy,
  RtStrategy,
} from '@libs/typings';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomRpcExceptionFilter } from '../app/filters';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTHORIZER_MICROSERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: AUTHORIZER_GROUP_ID,
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: AUTHORIZER_GROUP_ID,
          },
        },
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    {
      provide: APP_FILTER,
      useClass: CustomRpcExceptionFilter,
    },
  ],
})
export class AuthModule {}
