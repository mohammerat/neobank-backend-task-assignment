import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AtStrategy, RtStrategy } from '@libs/typings';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController],
  providers: [AppService, PrismaService, AtStrategy, RtStrategy],
})
export class AppModule {}
