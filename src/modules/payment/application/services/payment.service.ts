import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { BookingCreatedEvent, BookingCanceledEvent } from '../../../../shared/events/booking.events';
import { BookingPaymentEntity } from '../../infrastructure/entity/booking-payment.entity';
import { BarbershopStripeAccountEntity } from '../../infrastructure/entity/barbershop-stripe-account.entity';

@Injectable()
export class PaymentService {
  private readonly stripe: any;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(BookingPaymentEntity)
    private readonly paymentRepo: Repository<BookingPaymentEntity>,
    @InjectRepository(BarbershopStripeAccountEntity)
    private readonly accountRepo: Repository<BarbershopStripeAccountEntity>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2023-10-16' as any,
    });
  }

  @OnEvent('booking.created')
  async handleBookingCreated(event: BookingCreatedEvent) {
    try {
      if (event.price <= 0) return;

      const account = await this.accountRepo.findOne({
        where: { barbershopId: event.barbershopId },
      });

      if (!account) {
        this.logger.warn(`No Stripe account linked for Barbershop \${event.barbershopId}`);
        return;
      }

      const amountCents = Math.round(event.price * 100);
      const feePercentage = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '10') / 100;
      const platformFeeCents = Math.round(amountCents * feePercentage);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'brl',
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: account.stripeAccountId,
        },
        metadata: {
          bookingId: event.bookingId,
          customerId: event.customerId,
          serviceId: event.serviceId,
        },
      });

      const payment = this.paymentRepo.create({
        bookingId: event.bookingId,
        stripePaymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret || undefined,
        amountCents,
        platformFeeCents,
        status: 'PENDING',
      });

      await this.paymentRepo.save(payment);
      this.logger.log(`Created payment intent for booking \${event.bookingId}`);
    } catch (e) {
      this.logger.error(`Failed to handle booking.created for \${event.bookingId}`, e);
    }
  }

  @OnEvent('booking.canceled')
  async handleBookingCanceled(event: BookingCanceledEvent) {
    try {
      if (!event.canceledByBarbershopOwner) {
         // Se o barbeiro nao cancelou, nao fazemos reembolso automatico ou aplicamos regras diferentes
         this.logger.log(`Booking \${event.bookingId} canceled by customer. No auto-refund applied.`);
         return;
      }

      const payment = await this.paymentRepo.findOne({
        where: { bookingId: event.bookingId },
      });

      if (!payment) return;

      if (payment.stripePaymentIntentId) {
        await this.stripe.refunds.create({
          payment_intent: payment.stripePaymentIntentId,
        });

        payment.status = 'REFUNDED';
        await this.paymentRepo.save(payment);
        this.logger.log(`Refunded payment for booking \${event.bookingId}`);
      }
    } catch (e) {
      this.logger.error(`Failed to handle booking.canceled for \${event.bookingId}`, e);
    }
  }
}
