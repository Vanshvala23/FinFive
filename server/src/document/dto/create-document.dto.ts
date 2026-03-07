import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsMongoId()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;
}