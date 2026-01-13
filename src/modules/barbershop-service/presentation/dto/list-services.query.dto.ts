import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/presentation/dto/pagination.query.dto';

export class ListServicesQueryDto extends PaginationQueryDto {
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

  @IsOptional()
  @IsIn(['name', 'price', 'durationMinutes'])
  declare sortBy?: 'name' | 'price' | 'durationMinutes';

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  declare sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
