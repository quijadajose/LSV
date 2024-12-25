import { IsString, IsNumber, IsPort } from 'class-validator';

export class EnvConfig {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @IsPort() // Valida que sea un puerto válido
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;
}