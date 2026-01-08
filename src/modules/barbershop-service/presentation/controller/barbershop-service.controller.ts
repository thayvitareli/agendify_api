import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterServiceUseCase } from '../../use-cases/register-service.use-case';
import { RegisterServiceDto } from '../dto/register-service.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';
import { BarbershopServicePresenter } from '../presenters/barbershop-service.presenter';

@Controller('barbershop-service')
@UseGuards(JwtAuthGuard)
export class BarbershopServiceController {
  constructor(
    private readonly registerServiceUseCase: RegisterServiceUseCase,
  ) {}

  @Post()
  async createService(
    @Body() body: RegisterServiceDto,
    @CurrentUser() user: AuthUser,
  ) {
    const service = await this.registerServiceUseCase.execute(body, user.userId);
    return BarbershopServicePresenter.toHttp(service);
  }
}
