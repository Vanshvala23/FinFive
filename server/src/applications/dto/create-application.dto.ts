import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'jane.doe@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty({ example: 'Bachelor of Commerce' })
  @IsNotEmpty()
  @IsString()
  highestEducationQualification!: string;

  @ApiPropertyOptional({ example: '42 MG Road' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: 'India' })
  @IsNotEmpty()
  @IsString()
  country!: string;
}