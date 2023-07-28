import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  AUTHORIZER_EVENTS,
  AUTHORIZER_MICROSERVICE,
  ChangePasswordDto,
  LoginDto,
  SignUpDto,
  VerifyMobileDto,
  ChangePasswordRO,
  LoginRO,
  SignUpRO,
  VerifyMobileRO,
  IUser,
  RefreshTokenDto,
  ChangePasswordPayload,
  RefreshTokenPayload,
} from '@libs/typings';

@Injectable()
export class AppService implements OnModuleInit {
  private logger: Logger;

  constructor(
    @Inject(AUTHORIZER_MICROSERVICE)
    private readonly authorizerClient: ClientKafka
  ) {
    this.logger = new Logger('Gateway/AppService');
  }

  async onModuleInit() {
    Object.values(AUTHORIZER_EVENTS).forEach((event) =>
      this.authorizerClient.subscribeToResponseOf(event)
    );

    await this.authorizerClient.connect();
  }

  async signup(
    dto: SignUpDto,
    callback: (err: Error | null, result?: SignUpRO) => void
  ) {
    try {
      const user = await firstValueFrom(
        this.authorizerClient.send<IUser, SignUpDto>(
          AUTHORIZER_EVENTS.CREATE_USER,
          dto
        )
      );

      this.authorizerClient
        .send<SignUpRO, string>(
          AUTHORIZER_EVENTS.SEND_VERIFICATION_CODE,
          user.mobile
        )
        .subscribe({
          next: (result) => callback(null, result),
          error: (err) => callback(err),
        });
    } catch (e) {
      this.logger.error(e);
      callback(e);
    }
  }

  verify(
    dto: VerifyMobileDto,
    callback: (err: Error | null, result?: VerifyMobileRO) => void
  ) {
    this.authorizerClient
      .send<VerifyMobileRO, VerifyMobileDto>(AUTHORIZER_EVENTS.VERIFY_USER, dto)
      .subscribe({
        next: (result) => callback(null, result),
        error: (err) => callback(err),
      });
  }

  login(
    dto: LoginDto,
    callback: (err: Error | null, result?: LoginRO) => void
  ) {
    this.authorizerClient
      .send<LoginRO, LoginDto>(AUTHORIZER_EVENTS.LOGIN, dto)
      .subscribe({
        next: (result) => {
          console.log(result);
          callback(null, result);
        },
        error: (err) => callback(err),
      });
  }

  changePassword(
    user: IUser,
    dto: ChangePasswordDto,
    callback: (err: Error | null, result?: ChangePasswordRO) => void
  ) {
    this.authorizerClient
      .send<ChangePasswordRO, ChangePasswordPayload>(
        AUTHORIZER_EVENTS.CHANGE_PASSWORD,
        { ...dto, id: user.id }
      )
      .subscribe({
        next: (result) => callback(null, result),
        error: (err) => callback(err),
      });
  }

  refreshToken(
    user: IUser,
    dto: RefreshTokenDto,
    callback: (err: Error | null, result?: LoginRO) => void
  ) {
    this.authorizerClient
      .send<LoginRO, RefreshTokenPayload>(AUTHORIZER_EVENTS.REFRESH_TOKEN, {
        ...dto,
        id: user.id,
      })
      .subscribe({
        next: (result) => callback(null, result),
        error: (err) => callback(err),
      });
  }
}
