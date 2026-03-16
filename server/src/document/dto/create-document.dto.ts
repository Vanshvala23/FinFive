import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: '664f1b2c8e4a2b001e3d9a11', description: 'MongoDB ObjectId of the customer' })
  @IsMongoId()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ example: 'Q3_Report.pdf' })
  @IsString()
  @IsNotEmpty()
  originalName!: string;
}