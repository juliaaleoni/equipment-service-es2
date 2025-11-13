import { IsString, IsOptional } from 'class-validator';

export class UpdateTotemDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
