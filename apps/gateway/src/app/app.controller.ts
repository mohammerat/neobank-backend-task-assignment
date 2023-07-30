import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ChangePasswordDto,
  ChangePasswordRO,
  GetCurrentUser,
  IUser,
  LoginDto,
  LoginRO,
  RefreshTokenDto,
  SignUpDto,
  SignUpRO,
  VerifyMobileDto,
  VerifyMobileRO,
} from '@libs/typings';

import { AtGuard, RtGuard } from './guards';
import { AppService } from './app.service';

@ApiTags('Gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBody({
    type: SignUpDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
  })
  @Post('sign-up')
  async signup(@Body() dto: SignUpDto) {
    try {
      return await new Promise<SignUpRO>((resolve, reject) => {
        this.appService.signup(dto, (err, result) => {
          if (err) {
            reject({ message: err, status: 500 });
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBody({
    type: VerifyMobileDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
  })
  @Post('verify')
  async verify(@Body() dto: VerifyMobileDto) {
    try {
      return await new Promise<VerifyMobileRO>((resolve, reject) => {
        this.appService.verify(dto, (err, result) => {
          if (err) {
            reject({ message: err, status: 500 });
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBody({
    type: LoginDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await new Promise<LoginRO>((resolve, reject) => {
        this.appService.login(dto, (err, result) => {
          if (err) {
            reject({ message: err, status: 500 });
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
  })
  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Post('change-password')
  async changePassword(
    @GetCurrentUser() user: IUser,
    @Body() dto: ChangePasswordDto
  ) {
    try {
      return await new Promise<ChangePasswordRO>((resolve, reject) => {
        this.appService.changePassword(user, dto, (err, result) => {
          if (err) {
            reject({ message: err, status: 500 });
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBody({
    type: RefreshTokenDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
  })
  @ApiBearerAuth()
  @UseGuards(RtGuard)
  @Post('refresh-token')
  async refreshToken(
    @GetCurrentUser() user: IUser,
    @Body() dto: RefreshTokenDto
  ) {
    try {
      return await new Promise<LoginRO>((resolve, reject) => {
        this.appService.refreshToken(user, dto, (err, result) => {
          if (err) {
            reject({ message: err, status: 500 });
          }
          resolve(result);
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AtGuard)
  @Get('me')
  me(@GetCurrentUser() user: IUser) {
    return user;
  }
}
