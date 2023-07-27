import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcryptjs from 'bcryptjs';

import {
  ChangePasswordPayload,
  IUser,
  JwtPayload,
  LoginDto,
  RefreshTokenPayload,
  SignUpDto,
  VerifyMobileRO,
  jwtConstants,
} from '@libs/typings';

import { PrismaService } from './prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private logger: Logger;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
    this.logger = new Logger('Authorizer/Service');
  }

  async createUser(dto: SignUpDto) {
    return this.prisma.exclude(
      await this.prisma.user.create({
        data: {
          ...dto,
          password: bcryptjs.hashSync(dto.password, 10),
          registeredAt: new Date(),
        },
      })
    );
  }

  async sendVerificationCode(mobile: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        mobile,
      },
    });

    if (!user) {
      throw new RpcException({
        message: 'User Not Found',
      });
    }

    const verificationCode = String(Math.floor(Math.random() * 90000) + 10000);

    this.logger.log(
      `Verification Code has been sent to ${user.mobile}: ${verificationCode}`
    );

    await this.prisma.user.update({
      where: {
        mobile,
      },
      data: {
        verificationCode,
      },
    });

    return {
      message: 'Verification Code has been sent',
      status: 200,
    } as VerifyMobileRO;
  }

  async handleLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        mobile: dto.mobile,
      },
    });

    if (!user) {
      throw new RpcException({
        message: 'User Not Found',
      });
    }

    if (!bcryptjs.compareSync(dto.password, user.password)) {
      throw new RpcException({
        message: 'Mobile or Password is incorrect',
      });
    }

    const tokens = await this.getTokens(this.prisma.exclude(user));

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRefreshToken: bcryptjs.hashSync(tokens.refresh_token, 10),
      },
    });

    return {
      message: 'Login successfully',
      status: 200,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async changePassword(payload: ChangePasswordPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new RpcException({
        message: 'User Not Found',
      });
    }

    if (!bcryptjs.compareSync(payload.oldPassword, user.password)) {
      throw new RpcException({
        message: 'Current Password is incorrect',
      });
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: bcryptjs.hashSync(payload.newPassword, 10),
        lastPasswordChanged: payload.oldPassword,
      },
    });

    return {
      message: 'Password has been changed successfully',
      status: 200,
    };
  }

  async refreshToken(payload: RefreshTokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user || !user.hashedRefreshToken)
      throw new RpcException({ message: 'Access Denied' });

    const tokens = await this.getTokens(this.prisma.exclude(user));
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRefreshToken: bcryptjs.hashSync(tokens.refresh_token, 10),
      },
    });

    return {
      message: 'Token Refreshed',
      status: 200,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  private async getTokens(user: IUser) {
    const jwtPayload: JwtPayload = user;

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.at_secret,
        expiresIn: jwtConstants.at_expiresIn,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: jwtConstants.rt_secret,
        expiresIn: jwtConstants.rt_expiresIn,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
