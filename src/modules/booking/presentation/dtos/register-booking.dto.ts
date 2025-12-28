import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class RegisterBookingDto {
  @IsString()
  barbershopId: string;

  @IsString()
  customerId: string;

  @IsString()
  serviceId: string;

  @Transform(({ value }) => new Date(value))
  startAt: Date;
}
