import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import {
  AUTHORIZER_CLIENT_ID,
  AUTHORIZER_GROUP_ID,
  AUTHORIZER_MICROSERVICE,
  AtStrategy,
  RtStrategy,
} from '@libs/typings';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

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
  controllers: [AppController],
  providers: [AppService, AtStrategy, RtStrategy],
})
export class AppModule {}
