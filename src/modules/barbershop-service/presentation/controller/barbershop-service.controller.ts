import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RegisterServiceUseCase } from '../../use-cases/register-service.use-case';
import { RegisterServiceDto } from '../dto/register-service.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';
import { BarbershopServicePresenter } from '../presenters/barbershop-service.presenter';
import { ListServicesUseCase } from '../../use-cases/list-services.use-case';
import { ListServicesQueryDto } from '../dto/list-services.query.dto';

@Controller('barbershop-service')
export class BarbershopServiceController {
  constructor(
    private readonly registerServiceUseCase: RegisterServiceUseCase,
    private readonly listServicesUseCase: ListServicesUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createService(
    @Body() body: RegisterServiceDto,
    @CurrentUser() user: AuthUser,
  ) {
    const service = await this.registerServiceUseCase.execute(body, user.userId);
    return BarbershopServicePresenter.toHttp(service);
  }

  @Get()
  async listServices(@Query() query: ListServicesQueryDto) {
    const { services, total, page, limit } =
      await this.listServicesUseCase.execute(query);
    return {
      services: BarbershopServicePresenter.toHttpMany(services),
      pagination: { page, limit, total },
    };
  }
}
