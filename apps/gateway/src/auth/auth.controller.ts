import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ChangePasswordDto,
  ChangePasswordRO,
  GetCurrentUser,
  GetRefreshToken,
  IUser,
  LoginDto,
  LoginRO,
  SignUpDto,
  SignUpRO,
  VerifyMobileDto,
  VerifyMobileRO,
} from '@libs/typings';

import { AuthService } from './auth.service';
import { AtGuard, RtGuard } from '../app/guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register user',
  })
  @ApiBody({
    type: SignUpDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('sign-up')
  async signup(@Body() dto: SignUpDto) {
    try {
      return await new Promise<SignUpRO>((resolve, reject) => {
        this.authService.signup(dto, (err, result) => {
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

  @ApiOperation({
    summary: 'Verify user mobile number',
  })
  @ApiBody({
    type: VerifyMobileDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('verify')
  async verify(@Body() dto: VerifyMobileDto) {
    try {
      return await new Promise<VerifyMobileRO>((resolve, reject) => {
        this.authService.verify(dto, (err, result) => {
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

  @ApiOperation({
    summary: 'Login',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await new Promise<LoginRO>((resolve, reject) => {
        this.authService.login(dto, (err, result) => {
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

  @ApiOperation({
    summary: 'Change password of user',
  })
  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
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
        this.authService.changePassword(user, dto, (err, result) => {
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

  @ApiOperation({
    summary:
      'Renew token with refresh token that had been set in header as a bearer token',
  })
  @ApiBadRequestResponse({
    description: 'Input is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBearerAuth()
  @UseGuards(RtGuard)
  @Post('refresh-token')
  async refreshToken(
    @GetCurrentUser() user: IUser,
    @GetRefreshToken() token: string
  ) {
    try {
      return await new Promise<LoginRO>((resolve, reject) => {
        this.authService.refreshToken(user, token, (err, result) => {
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

  @ApiOperation({
    summary: 'Who Am I?',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Return user model',
  })
  @ApiUnauthorizedResponse({
    description: 'token is not valid',
  })
  @ApiInternalServerErrorResponse({
    description: 'internal server error',
  })
  @UseGuards(AtGuard)
  @Get('me')
  me(@GetCurrentUser() user: IUser) {
    return user;
  }
}
