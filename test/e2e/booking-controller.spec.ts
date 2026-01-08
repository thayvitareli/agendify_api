import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { DataSource, Repository } from 'typeorm';
import { BarbershopServiceModule } from 'src/modules/barbershop-service/barbershop-service.module';
import { UserModule } from 'src/modules/user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from 'src/modules/booking/booking.module';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;
  let barbershopRepository: Repository<BarbershopEntity>;
  let customerRepository: Repository<CustomerEntity>;
  let barbershopServiceRepository: Repository<BarbershopServiceEntity>;
  let bookingRepository: Repository<BookingEntity>;
  let jwtService: JwtService;
  let ownerToken: string;
  let customerToken: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            CustomerEntity,
            UserEntity,
            BookingEntity,
            BarbershopEntity,
            BarbershopServiceEntity,
          ],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        BarbershopServiceModule,
        UserModule,
        BookingModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    jwtService = app.get(JwtService);
    userRepository = dataSource.getRepository(UserEntity);
    barbershopRepository = dataSource.getRepository(BarbershopEntity);
    customerRepository = dataSource.getRepository(CustomerEntity);
    barbershopServiceRepository = dataSource.getRepository(
      BarbershopServiceEntity,
    );
    bookingRepository = dataSource.getRepository(BookingEntity);
  });

  beforeEach(async () => {
    await dataSource.getRepository(BookingEntity).clear();
    await dataSource.getRepository(BarbershopServiceEntity).clear();
    await dataSource.getRepository(BarbershopEntity).clear();
    await dataSource.getRepository(CustomerEntity).clear();
    await dataSource.getRepository(UserEntity).clear();

    await userRepository.save({
      id: 'user-1',
      name: 'Owner',
      email: 'owner@test.com',
      password: 'hash',
    });

    await barbershopRepository.save({
      id: 'shop-1',
      ownerUserId: 'user-1',
      name: 'Barber Shop',
      phone: '12345678',
      street: 'Main St',
      number: '123',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '12345',
    });

    await barbershopServiceRepository.save({
      id: 'service-1',
      barbershopId: 'shop-1',
      name: 'Corte',
      durationMinutes: 30,
      price: 50,
      active: true,
    });

    await userRepository.save({
      id: 'user-2',
      name: 'Customer',
      email: 'customer@test.com',
      password: 'hash',
    });

    await customerRepository.save({
      id: 'customer-1',
      userId: 'user-2',
      phone: '87654321',
    });

    await bookingRepository.save({
      id: 'booking-id',
      barbershopId: 'shop-1',
      serviceId: 'service-1',
      customerId: 'customer-1',
      startAt: new Date('2025-12-20T10:00:00Z'),
      endAt: new Date('2025-12-20T10:30:00Z'),
      status: 'CONFIRMED',
    });

    ownerToken = jwtService.sign({ sub: 'user-1', email: 'owner@test.com' });
    customerToken = jwtService.sign({
      sub: 'user-2',
      email: 'customer@test.com',
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('POST /Booking (Register)', () => {
    it('should register a new booking', () => {
      return request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          barbershopId: 'shop-1',
          serviceId: 'service-1',
          customerId: 'customer-1',
          startAt: '2025-12-24T10:00:00Z',
        })
        .expect(201);
    });
  });

  describe('POST /Cancel booking', () => {
    it('should cancel a booking', () => {
      return request(app.getHttpServer())
        .post('/booking/booking-id/cancel')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(201);
    });

    it('should throw an error when canceling a non-existent booking', async () => {
      const resp = await request(app.getHttpServer())
        .post('/booking/no-existing-booking-id/cancel')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(resp.status).toBe(404);
      expect(resp.body.message).toBe('Booking not found');
    });

    it('should throw an error when trying to cancel a booking already canceled', async () => {
      await bookingRepository.update('booking-id', { status: 'CANCELED' });

      const resp = await request(app.getHttpServer())
        .post('/booking/booking-id/cancel')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(409);

      expect(resp.status).toBe(409);
      expect(resp.body.message).toBe('Booking already canceled.');
    });
  });
});
