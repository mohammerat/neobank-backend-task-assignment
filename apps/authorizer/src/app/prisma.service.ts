import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  exclude(user: User) {
    const {
      password,
      verificationCode,
      hashedRefreshToken,
      updatedAt,
      deletedAt,
      bannedBy,
      ...rest
    } = user;
    return rest;
  }
}
