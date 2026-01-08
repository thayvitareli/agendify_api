import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBarbershopUseCase } from '../../use-cases/register-barbershop.use-case';
import CreateBarbershopDto from '../dto/create-barbershop.dto';
import { BarbershopPresenter } from '../presenters/barbershop.presenter';
import { UserPresenter } from 'src/modules/user/presentation/presenters/user.presenter';

@Controller('barbershop')
export class BarbershopController {
  constructor(
    private readonly registerBarbershopUseCase: RegisterBarbershopUseCase,
  ) {}

  @Post()
  async createsBarbershop(@Body() body: CreateBarbershopDto) {
    const { user, barbershop } =
      await this.registerBarbershopUseCase.execute(body);
    return {
      user: UserPresenter.toHttp(user),
      barbershop: BarbershopPresenter.toHttp(barbershop),
    };
  }
}
