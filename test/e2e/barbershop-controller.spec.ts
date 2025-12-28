import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { AppModule } from 'src/app.module';

describe('BarbershopController (e2e)', () => {
  let app: INestApplication;

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
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /barbershop (Register)', () => {
    it('should register a new barbershop', () => {
      return request(app.getHttpServer())
        .post('/barbershop')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          password: 'securePassword',
          address: {
            street: 'Main St',
            city: 'Anytown',
            state: 'CA',
            number: '123',
            zipCode: '12345',
            country: 'USA',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('barbershop');
          expect(res.body.barbershop).toMatchObject({
            _id: expect.any(String),
          });
        });
    });

    it('should throw an error if name is empty', () => {
      return request(app.getHttpServer())
        .post('/barbershop')
        .send({
          name: '',
          email: 'john@example.com',
          phone: '1234567890',
          password: 'securePassword',
          address: {
            street: 'Main St',
            city: 'Anytown',
            state: 'CA',
            number: '123',
            zipCode: '12345',
            country: 'USA',
          },
        })
        .expect(500);
    });
  });
});
