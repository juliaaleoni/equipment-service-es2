import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLockDto {
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
