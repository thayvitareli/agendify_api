import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RegisterServiceUseCase } from '../../use-cases/register-service.use-case';
import { RegisterServiceDto } from '../dto/register-service.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';

@Controller('barbershop-service')
@UseGuards(JwtAuthGuard)
export class BarbershopServiceController {
  constructor(
    private readonly registerServiceUseCase: RegisterServiceUseCase,
  ) {}

  @Post()
  createService(@Body() body: RegisterServiceDto, @CurrentUser() user: AuthUser) {
    return this.registerServiceUseCase.execute(body, user.userId);
  }
}
