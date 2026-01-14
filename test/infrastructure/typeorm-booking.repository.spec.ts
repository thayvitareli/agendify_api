import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { Booking } from 'src/modules/booking/domain/model/booking.model';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { TypeORMBookingRepository } from 'src/modules/booking/infrastructure/repositories/typeorm-booking.repository';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

describe('TypeORMBookingRepository', () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;
  let userRepository: Repository<UserEntity>;
  let barbershopRepository: Repository<BarbershopEntity>;
  let barbershopServiceRepository: Repository<BarbershopServiceEntity>;
  let customerRepository: Repository<CustomerEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [
        UserEntity,
        BookingEntity,
        CustomerEntity,
        BarbershopEntity,
        BarbershopServiceEntity,
      ],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();

    bookingRepository = new TypeORMBookingRepository(
      dataSource.getRepository(BookingEntity),
    );

    userRepository = dataSource.getRepository(UserEntity);

    customerRepository = dataSource.getRepository(CustomerEntity);

    barbershopRepository = dataSource.getRepository(BarbershopEntity);
    barbershopServiceRepository = dataSource.getRepository(
      BarbershopServiceEntity,
    );
  });

  beforeEach(async () => {
    await dataSource.getRepository(BookingEntity).clear();
    await dataSource.getRepository(BarbershopServiceEntity).clear();
    await dataSource.getRepository(BarbershopEntity).clear();
    await dataSource.getRepository(CustomerEntity).clear();
    await dataSource.getRepository(UserEntity).clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should register a booking', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Charlie',
      email: 'charlie@teste.com',
      password: 'hash',
    });

    const customer = await customerRepository.save({
      id: 'customer-1',
      userId: 'user-1',
      phone: '999999999',
    });

    const userBarbershopOwner = await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@teste.com',
      password: 'hash',
    });

    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');

    const barbershop = new Barbershop(
      'shop-1',
      userBarbershopOwner.id,
      '5555-1234',
      'Barber Shop',
      address,
    );

    const savedBarbershop = await barbershopRepository.save({
      id: barbershop.id,
      ownerUserId: barbershop.ownerUserId,
      name: barbershop.name,
      phone: barbershop.phone || '',
      city: barbershop.address.city,
      number: barbershop.address.number,
      state: barbershop.address.state,
      street: barbershop.address.street,
      zipCode: barbershop.address.zipCode,
    });

    const savedService = await barbershopServiceRepository.save({
      id: 'service-1',
      barbershopId: savedBarbershop.id,
      name: 'Haircut',
      durationMinutes: 30,
      price: 25.0,
      active: true,
    });

    const booking = new Booking(
      'booking-1',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );

    const savedBooking = await bookingRepository.save(booking);

    expect(savedBooking).toBeInstanceOf(Booking);
    expect(savedBooking?.id).toBe('booking-1');
    expect(savedBooking?.barbershopId).toBe(savedBarbershop.id);
    expect(savedBooking?.customerId).toBe(customer.id);
    expect(savedBooking?.serviceId).toBe(savedService.id);
    expect(savedBooking?.startAt.toISOString()).toBe(
      '2025-12-24T10:00:00.000Z',
    );
    expect(savedBooking?.endAt.toISOString()).toBe('2025-12-24T10:30:00.000Z');
    expect(savedBooking?.status).toBe('PENDING');
    expect(savedBooking?.canceledAt).toBeNull();
  });

  it('should return a booking when id is found', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Charlie',
      email: 'charlie@teste.com',
      password: 'hash',
    });
    const customer = await customerRepository.save({
      id: 'customer-1',
      userId: 'user-1',
      phone: '999999999',
    });
    const userBarbershopOwner = await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@teste.com',
      password: 'hash',
    });
    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');
    const barbershop = new Barbershop(
      'shop-1',
      userBarbershopOwner.id,
      '5555-1234',
      'Barber Shop',
      address,
    );
    const savedBarbershop = await barbershopRepository.save({
      id: barbershop.id,
      ownerUserId: barbershop.ownerUserId,
      name: barbershop.name,
      phone: barbershop.phone || '',
      city: barbershop.address.city,
      number: barbershop.address.number,
      state: barbershop.address.state,
      street: barbershop.address.street,
      zipCode: barbershop.address.zipCode,
    });
    const savedService = await barbershopServiceRepository.save({
      id: 'service-1',
      barbershopId: savedBarbershop.id,
      name: 'Haircut',
      durationMinutes: 30,
      price: 25.0,
      active: true,
    });
    const booking = new Booking(
      'booking-1',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    await bookingRepository.save(booking);
    const foundBooking = await bookingRepository.findById('booking-1');
    expect(foundBooking).toBeInstanceOf(Booking);
    expect(foundBooking?.id).toBe('booking-1');
    expect(foundBooking?.barbershopId).toBe(savedBarbershop.id);
    expect(foundBooking?.customerId).toBe(customer.id);
    expect(foundBooking?.serviceId).toBe(savedService.id);
    expect(foundBooking?.startAt.toISOString()).toBe(
      '2025-12-24T10:00:00.000Z',
    );
    expect(foundBooking?.endAt.toISOString()).toBe('2025-12-24T10:30:00.000Z');
    expect(foundBooking?.status).toBe('PENDING');
    expect(foundBooking?.canceledAt).toBeNull();
  });

  it('should return null when booking id is not found', async () => {
    const foundBooking = await bookingRepository.findById('non-existing-id');
    expect(foundBooking).toBeNull();
  });

  it('should return many bookings by barbershop id', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Charlie',
      email: 'charlie@teste.com',

      password: 'hash',
    });
    const customer = await customerRepository.save({
      id: 'customer-1',
      userId: 'user-1',
      phone: '999999999',
    });
    const userBarbershopOwner = await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@teste.com',
      password: 'hash',
    });
    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');
    const barbershop = new Barbershop(
      'shop-1',
      userBarbershopOwner.id,
      '5555-1234',
      'Barber Shop',
      address,
    );
    const savedBarbershop = await barbershopRepository.save({
      id: barbershop.id,
      ownerUserId: barbershop.ownerUserId,
      name: barbershop.name,
      phone: barbershop.phone || '',
      city: barbershop.address.city,
      number: barbershop.address.number,
      state: barbershop.address.state,
      street: barbershop.address.street,
      zipCode: barbershop.address.zipCode,
    });
    const savedService = await barbershopServiceRepository.save({
      id: 'service-1',
      barbershopId: savedBarbershop.id,
      name: 'Haircut',
      durationMinutes: 30,
      price: 25.0,
      active: true,
    });
    const booking1 = new Booking(
      'booking-1',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    const booking2 = new Booking(
      'booking-2',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T11:00:00Z'),
      new Date('2025-12-24T11:30:00Z'),
    );
    await bookingRepository.save(booking1);
    await bookingRepository.save(booking2);
    const { bookings: foundBookings, total } = await bookingRepository.findManyByBarbershopId(
      savedBarbershop.id,
    );
    expect(foundBookings).toHaveLength(2);
    expect(total).toBe(2);
    expect(foundBookings[0]).toBeInstanceOf(Booking);
    expect(foundBookings[1]).toBeInstanceOf(Booking);
    expect(foundBookings[0].barbershopId).toBe(savedBarbershop.id);
    expect(foundBookings[1].barbershopId).toBe(savedBarbershop.id);
  });

  it('should return many bookings by customer id', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Charlie',
      email: 'charlie@teste.com',
      password: 'hash',
    });
    const customer = await customerRepository.save({
      id: 'customer-1',
      userId: 'user-1',
      phone: '999999999',
    });
    const userBarbershopOwner = await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@teste.com',
      password: 'hash',
    });
    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');
    const barbershop = new Barbershop(
      'shop-1',
      userBarbershopOwner.id,
      '5555-1234',
      'Barber Shop',
      address,
    );
    const savedBarbershop = await barbershopRepository.save({
      id: barbershop.id,
      ownerUserId: barbershop.ownerUserId,
      name: barbershop.name,
      phone: barbershop.phone || '',
      city: barbershop.address.city,
      number: barbershop.address.number,
      state: barbershop.address.state,
      street: barbershop.address.street,
      zipCode: barbershop.address.zipCode,
    });
    const savedService = await barbershopServiceRepository.save({
      id: 'service-1',

      barbershopId: savedBarbershop.id,
      name: 'Haircut',
      durationMinutes: 30,
      price: 25.0,
      active: true,
    });
    const booking1 = new Booking(
      'booking-1',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T10:00:00Z'),
      new Date('2025-12-24T10:30:00Z'),
    );
    const booking2 = new Booking(
      'booking-2',
      savedBarbershop.id,
      customer.id,
      savedService.id,
      new Date('2025-12-24T11:00:00Z'),
      new Date('2025-12-24T11:30:00Z'),
    );
    await bookingRepository.save(booking1);
    await bookingRepository.save(booking2);
    const { bookings: foundBookings, total } = await bookingRepository.findManyByCustomerId(
      customer.id,
    );
    expect(foundBookings).toHaveLength(2);
    expect(total).toBe(2);
    expect(foundBookings[0]).toBeInstanceOf(Booking);
    expect(foundBookings[1]).toBeInstanceOf(Booking);
    expect(foundBookings[0].customerId).toBe(customer.id);
    expect(foundBookings[1].customerId).toBe(customer.id);
  });
});
