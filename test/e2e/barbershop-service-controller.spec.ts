import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { DataSource, Repository } from 'typeorm';
import { BarbershopModule } from 'src/modules/barbershop/barbershop.module';
import { BarbershopServiceModule } from 'src/modules/barbershop-service/barbershop-service.module';
import { UserModule } from 'src/modules/user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('BarbershopServiceController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;
  let barbershopRepository: Repository<BarbershopEntity>;

  beforeAll(async () => {
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
        BarbershopModule,
        BarbershopServiceModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(UserEntity);
    barbershopRepository = dataSource.getRepository(BarbershopEntity);
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
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('POST /barbershop-service (Register)', () => {
    it('should register a new barbershop service', () => {
      return request(app.getHttpServer())
        .post('/barbershop-service')
        .send({
          barbershopId: 'shop-1',
          name: 'Corte',
          durationInMinutes: 30,
          price: 50,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            _id: expect.any(String),
            _barbershopId: 'shop-1',
            _name: 'Corte',
            _durationMinutes: 30,
          });
        });
    });

    it('should throw an error if name is empty', () => {
      return request(app.getHttpServer())
        .post('/barbershop-service')
        .send({
          barbershopId: 'shop-1',
          name: '',
          durationInMinutes: 30,
          price: 50,
        })
        .expect(500);
    });
  });
});
