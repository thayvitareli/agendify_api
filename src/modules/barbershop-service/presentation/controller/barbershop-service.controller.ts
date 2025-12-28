import { Body, Controller, Post } from '@nestjs/common';
import { RegisterServiceUseCase } from '../../use-cases/register-service.use-case';
import { RegisterServiceDto } from '../dto/register-service.dto';

@Controller('barbershop-service')
export class BarbershopServiceController {
  constructor(
    private readonly registerServiceUseCase: RegisterServiceUseCase,
  ) {}

  @Post()
  createService(@Body() body: RegisterServiceDto) {
    return this.registerServiceUseCase.execute(body);
  }
}
