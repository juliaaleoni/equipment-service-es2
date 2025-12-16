import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateLockDto {
  @IsNumber()
  @IsOptional()
  number?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  manufactureYear?: string;

  @IsString()
  @IsOptional()
  model?: string;
}
