import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "User's mobile",
    type: String,
  })
  @IsString()
  @Matches(/^(0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/)
  mobile: string;

  @ApiProperty({
    description: 'Password',
    type: String,
  })
  @IsString()
  password: string;
}
