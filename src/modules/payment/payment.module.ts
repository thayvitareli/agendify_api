import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingPaymentEntity } from './infrastructure/entity/booking-payment.entity';
import { BarbershopStripeAccountEntity } from './infrastructure/entity/barbershop-stripe-account.entity';
import { PaymentService } from './application/services/payment.service';
import { PaymentController } from './presentation/controllers/payment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingPaymentEntity,
      BarbershopStripeAccountEntity,
    ]),
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
