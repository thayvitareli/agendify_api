import { IsEmail, IsObject, IsString } from 'class-validator';
import { Address } from '../../domain/value_objects/address.vo';

export default class CreateBarbershopDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsObject()
  address: Address;
}
