import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CustomerModule } from '../../src/modules/customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';

describe('CustomerController (e2e)', () => {
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
        CustomerModule,
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

  describe('POST /customer (Register)', () => {
    it('should register a new customer', () => {
      return request(app.getHttpServer())
        .post('/customer')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          password: 'securePassword',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('customer');
          expect(res.body.customer).toMatchObject({ id: expect.any(String) });
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toMatchObject({ id: expect.any(String) });
        });
    });

    // it('should fail with invalid data', () => {
    //   return request(app.getHttpServer())
    //     .post('/customers')
    //     .send({
    //       name: '',
    //       email: 'invalid-email',
    //     })
    //     .expect(400);
    // });
  });
});
