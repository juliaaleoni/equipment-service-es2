import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTotemDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
