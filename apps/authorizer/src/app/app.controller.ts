import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  AUTHORIZER_EVENTS,
  ChangePasswordPayload,
  LoginDto,
  RefreshTokenPayload,
  SignUpDto,
  VerifyMobileDto,
} from '@libs/typings';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(AUTHORIZER_EVENTS.CREATE_USER)
  async createUser(@Payload() dto: SignUpDto) {
    return this.appService.createUser(dto);
  }

  @MessagePattern(AUTHORIZER_EVENTS.SEND_VERIFICATION_CODE)
  sendVerificationCode(@Payload() mobile: string) {
    return this.appService.sendVerificationCode(mobile);
  }

  @MessagePattern(AUTHORIZER_EVENTS.VERIFY_USER)
  verifyUser(@Payload() dto: VerifyMobileDto) {
    return this.appService.verify(dto);
  }

  @MessagePattern(AUTHORIZER_EVENTS.LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.appService.login(dto);
  }

  @MessagePattern(AUTHORIZER_EVENTS.CHANGE_PASSWORD)
  changePassword(@Payload() payload: ChangePasswordPayload) {
    return this.appService.changePassword(payload);
  }

  @MessagePattern(AUTHORIZER_EVENTS.REFRESH_TOKEN)
  refreshToken(@Payload() payload: RefreshTokenPayload) {
    return this.appService.refreshToken(payload);
  }
}
