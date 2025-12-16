import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateBicycleDto {
  @IsNumber()
  @IsOptional()
  numero?: number;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  ano?: string;
}
