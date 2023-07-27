import { IsString, Matches, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { Gender } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'First name of user',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Last name of user',
    type: String,
  })
  @IsString()
  family: string;

  @ApiProperty({
    description: "User's mobile number",
    type: String,
  })
  @IsString()
  @Matches(/^(0)?9(0[0-5]|[1 3]\d|2[0-3]|9[0-9]|41)\d{7}$/)
  mobile: string;

  @ApiProperty({
    description: "User's age",
    type: Number,
    minimum: 18,
    maximum: 70,
  })
  @IsNumber()
  @Min(18)
  @Max(70)
  age: number;

  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    enumName: 'Gender',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: "Account's password",
    type: String,
  })
  @IsString()
  password: string;
}
