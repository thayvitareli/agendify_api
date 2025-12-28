import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBarbershopUseCase } from '../../use-cases/register-barbershop.use-case';
import CreateBarbershopDto from '../dto/create-barbershop.dto';

@Controller('barbershop')
export class BarbershopController {
  constructor(
    private readonly registerBarbershopUseCase: RegisterBarbershopUseCase,
  ) {}

  @Post()
  createsBarbershop(@Body() body: CreateBarbershopDto) {
    return this.registerBarbershopUseCase.execute(body);
  }
}
