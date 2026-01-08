import { Body, Controller, Post } from '@nestjs/common';
import { RegisterCustomerUseCase } from '../../use-cases/register-customer.use-case';
import { RegisterCustomerDto } from '../dto/register-customer.dto';
import { CustomerPresenter } from '../presenters/customer.presenter';
import { UserPresenter } from 'src/modules/user/presentation/presenters/user.presenter';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
  ) {}

  @Post()
  async createCustomer(@Body() body: RegisterCustomerDto) {
    const { user, customer } = await this.registerCustomerUseCase.execute(body);
    return {
      user: UserPresenter.toHttp(user),
      customer: CustomerPresenter.toHttp(customer),
    };
  }
}
