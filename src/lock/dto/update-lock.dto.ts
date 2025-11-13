import { IsString, IsOptional } from 'class-validator';

export class UpdateLockDto {
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
