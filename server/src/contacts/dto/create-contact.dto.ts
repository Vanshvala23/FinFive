import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({ example: 'Web Development', description: 'Selected from frontend dropdown' })
  @IsNotEmpty()
  @IsString()
  service: string;

  @ApiProperty({ example: 'I would like to discuss a project...' })
  @IsNotEmpty()
  @IsString()
  message: string;
}