import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Old password to sent',
    type: String,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New password to be set',
    type: String,
  })
  @IsString()
  newPassword: string;
}

export class ChangePasswordPayload {
  id: number;
  oldPassword: string;
  newPassword: string;
}
