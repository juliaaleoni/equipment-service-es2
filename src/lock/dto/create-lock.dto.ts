import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLockDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  manufactureYear: string;

  @IsString()
  @IsNotEmpty()
  model: string;
}
