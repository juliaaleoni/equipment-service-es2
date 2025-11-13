import { IsString, IsOptional } from 'class-validator';

export class UpdateBicycleDto {
  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  year?: string;
}
