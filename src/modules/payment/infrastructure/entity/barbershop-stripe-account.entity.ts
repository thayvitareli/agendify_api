import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('barbershop_stripe_accounts')
export class BarbershopStripeAccountEntity {
  @PrimaryColumn('uuid')
  barbershopId: string;

  @Column()
  stripeAccountId: string;
}
