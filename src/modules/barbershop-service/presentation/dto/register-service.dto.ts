import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RegisterServiceDto {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  durationInMinutes: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @IsString()
  barbershopId: string;
}
