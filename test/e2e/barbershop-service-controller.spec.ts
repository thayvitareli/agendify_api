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
import { BarbershopModule } from 'src/modules/barbershop/barbershop.module';
import { BarbershopServiceModule } from 'src/modules/barbershop-service/barbershop-service.module';
import { UserModule } from 'src/modules/user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('BarbershopServiceController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;
  let barbershopRepository: Repository<BarbershopEntity>;
  let barbershopServiceRepository: Repository<BarbershopServiceEntity>;
  let jwtService: JwtService;
  let ownerToken: string;

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
        BarbershopModule,
        BarbershopServiceModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    jwtService = app.get(JwtService);
    userRepository = dataSource.getRepository(UserEntity);
    barbershopRepository = dataSource.getRepository(BarbershopEntity);
    barbershopServiceRepository = dataSource.getRepository(BarbershopServiceEntity);
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

    await barbershopServiceRepository.save([
      {
        id: 'service-1',
        barbershopId: 'shop-1',
        name: 'Corte',
        durationMinutes: 30,
        price: 50,
        active: true,
      },
      {
        id: 'service-2',
        barbershopId: 'shop-1',
        name: 'Barba',
        durationMinutes: 20,
        price: 30,
        active: true,
      },
      {
        id: 'service-3',
        barbershopId: 'shop-1',
        name: 'Inativo',
        durationMinutes: 15,
        price: 10,
        active: false,
      },
    ]);

    ownerToken = jwtService.sign({ sub: 'user-1', email: 'owner@test.com' });
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
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          barbershopId: 'shop-1',
          name: 'Corte',
          durationInMinutes: 30,
          price: 50,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: expect.any(String),
            barbershopId: 'shop-1',
            name: 'Corte',
            durationInMinutes: 30,
          });
        });
    });

    it('should throw an error if name is empty', () => {
      return request(app.getHttpServer())
        .post('/barbershop-service')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          barbershopId: 'shop-1',
          name: '',
          durationInMinutes: 30,
          price: 50,
        })
        .expect(500);
    });
  });

  describe('GET /barbershop-service (List/Search)', () => {
    it('should list only active services by default', async () => {
      const resp = await request(app.getHttpServer())
        .get('/barbershop-service')
        .expect(200);

      expect(resp.body.services).toHaveLength(2);
      expect(resp.body.services.map((s: any) => s.id).sort()).toEqual([
        'service-1',
        'service-2',
      ]);
    });

    it('should filter by name', async () => {
      const resp = await request(app.getHttpServer())
        .get('/barbershop-service?name=cor')
        .expect(200);

      expect(resp.body.services).toHaveLength(1);
      expect(resp.body.services[0]).toMatchObject({ id: 'service-1' });
    });

    it('should filter by price range', async () => {
      const resp = await request(app.getHttpServer())
        .get('/barbershop-service?minPrice=40&maxPrice=60')
        .expect(200);

      expect(resp.body.services).toHaveLength(1);
      expect(resp.body.services[0]).toMatchObject({ id: 'service-1' });
    });

    it('should filter by barbershopId', async () => {
      const resp = await request(app.getHttpServer())
        .get('/barbershop-service?barbershopId=shop-1')
        .expect(200);

      expect(resp.body.services).toHaveLength(2);
      expect(resp.body.services.map((s: any) => s.id).sort()).toEqual([
        'service-1',
        'service-2',
      ]);
    });
  });
});
