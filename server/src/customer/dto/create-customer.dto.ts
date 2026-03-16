import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Acme Pvt Ltd' })
  @IsString()
  @IsNotEmpty()
  corporateEntityName!: string;

  @ApiProperty({ example: 'John Doe / john@acme.com' })
  @IsString()
  @IsNotEmpty()
  keyContactPerson!: string;

  @ApiProperty({ example: 5000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  initialAUM!: number;
}