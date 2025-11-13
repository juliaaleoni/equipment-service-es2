import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBicycleDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}
