import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/presentation/dto/pagination.query.dto';

export class ListBookingsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['startAt', 'endAt', 'status'])
  declare sortBy?: 'startAt' | 'endAt' | 'status';

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  declare sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
