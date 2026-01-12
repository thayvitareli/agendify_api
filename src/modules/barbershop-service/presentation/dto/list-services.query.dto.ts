import { IsOptional, IsString } from 'class-validator';

export class ListServicesQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  barbershopId?: string;

  @IsOptional()
  minPrice?: string;

  @IsOptional()
  maxPrice?: string;
}
