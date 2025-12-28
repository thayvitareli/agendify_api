import { Body, Controller, Post } from '@nestjs/common';
import { RegisterCustomerUseCase } from '../../use-cases/register-customer.use-case';
import { RegisterCustomerDto } from '../dto/register-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
  ) {}

  @Post()
  createCustomer(@Body() body: RegisterCustomerDto) {
    return this.registerCustomerUseCase.execute(body);
  }
}
