import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsNotEmpty()
  @IsString()
  company!: string;

  @ApiProperty({ example: 'Wealth Management' })
  @IsNotEmpty()
  @IsString()
  service!: string;

  @ApiProperty({ example: 'I would like to discuss investment options.' })
  @IsNotEmpty()
  @IsString()
  message!: string;
}