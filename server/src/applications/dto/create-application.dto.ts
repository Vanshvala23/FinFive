import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApplicationDto {

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  highestEducationQualification: string;

  @IsOptional()
  streetAddress: string;

  @IsNotEmpty()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  zipCode: string;

  @IsNotEmpty()
  country: string;
}