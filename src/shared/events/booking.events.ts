export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly barbershopId: string,
    public readonly customerId: string,
    public readonly serviceId: string,
    public readonly price: number,
  ) {}
}

export class BookingCanceledEvent {
  constructor(
    public readonly bookingId: string,
    public readonly canceledByBarbershopOwner: boolean,
  ) {}
}
