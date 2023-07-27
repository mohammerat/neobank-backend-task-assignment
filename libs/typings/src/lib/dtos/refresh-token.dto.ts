import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token must be sent to get new tokens',
    type: String,
  })
  @IsString()
  refresh_token: string;
}

export class RefreshTokenPayload {
  id: number;
  refresh_token: string;
}
