import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class VerifyMobileDto {
  @ApiProperty({
    description: "User's mobile number",
    type: String,
  })
  @IsString()
  @Matches(/^(098|0098|98|\+98|0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/)
  mobile: string;

  @ApiProperty({
    description: 'Verification Code Sent',
    type: String,
  })
  @IsString()
  @Length(5)
  verificationCode: string;
}
