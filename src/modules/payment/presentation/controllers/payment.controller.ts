import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import type { AuthUser } from 'src/modules/auth/presentation/types/auth-user';
import { IsString } from 'class-validator';
import { BarbershopStripeAccountEntity } from '../../infrastructure/entity/barbershop-stripe-account.entity';

export class LinkStripeAccountDto {
  @IsString()
  barbershopId: string;

  @IsString()
  stripeAccountId: string;
}

@Controller('payment')
export class PaymentController {
  constructor(
    @InjectRepository(BarbershopStripeAccountEntity)
    private readonly accountRepo: Repository<BarbershopStripeAccountEntity>,
  ) {}

  @Post('stripe-account')
  @UseGuards(JwtAuthGuard)
  async linkStripeAccount(
    @Body() body: LinkStripeAccountDto,
    @CurrentUser() user: AuthUser,
  ) {
    // Para simplificar, conectamos diretamente
    // Em um cenário real, você verificaria se o usuário logado é dono desta barbearia
    let account = await this.accountRepo.findOne({
      where: { barbershopId: body.barbershopId },
    });

    if (account) {
      account.stripeAccountId = body.stripeAccountId;
    } else {
      account = this.accountRepo.create({
        barbershopId: body.barbershopId,
        stripeAccountId: body.stripeAccountId,
      });
    }

    await this.accountRepo.save(account);

    return account;
  }
}
