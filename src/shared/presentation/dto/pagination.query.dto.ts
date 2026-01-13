import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? 1 : Number(value)))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? 20 : Number(value)))
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
