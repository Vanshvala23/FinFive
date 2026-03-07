import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  corporateEntityName: string;

  @IsString()
  @IsNotEmpty()
  keyContactPerson: string;

  @IsNumber()
  @Min(0)
  initialAUM: number;
}