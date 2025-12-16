import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateBicycleDto {
  // Segundo a documentação, o campo 'numero' é gerado automaticamente pelo sistema
  // Portanto, é opcional no DTO de criação
  @IsNumber()
  @IsOptional()
  numero?: number;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  ano: string;
}
