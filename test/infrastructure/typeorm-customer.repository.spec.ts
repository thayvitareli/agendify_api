import User from 'src/modules/user/domain/model/user.model';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { TypeORMUserRepository } from 'src/modules/user/infrastructure/repositories/type-orm-user.repository';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { DataSource, Repository } from 'typeorm';
import { TypeORMCustomerRepository } from 'src/modules/customer/infrastructure/repositories/typeorm-customer.repository';
import { Customer } from 'src/modules/customer/domain/model/customer.model';

describe('TypeORMCustomerRepository', () => {
  let dataSource: DataSource;
  let customerRepository: TypeORMCustomerRepository;
  let userRepository: Repository<UserEntity>;

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

    customerRepository = new TypeORMCustomerRepository(
      dataSource.getRepository(CustomerEntity),
    );

    userRepository = dataSource.getRepository(UserEntity);
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

  it('save should persist a customer and return domain', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Bob',
      email: 'bob@test.com',
      password: 'hash',
    });

    const savedCustomer = await customerRepository.save(
      new Customer('customer-1', 'user-1', '1234567890'),
    );

    expect(savedCustomer).toBeInstanceOf(Customer);
    expect(savedCustomer?.id).toBe('customer-1');
    expect(savedCustomer?.userId).toBe('user-1');
    expect(savedCustomer?.phone).toBe('1234567890');

    const persisted = await dataSource
      .getRepository(CustomerEntity)
      .findOne({ where: { id: 'customer-1' } });
    expect(persisted?.id).toBe('customer-1');
    expect(persisted?.userId).toBe('user-1');
    expect(persisted?.phone).toBe('1234567890');
  });

  it('should return a customer when id is found', async () => {
    await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@test.com',
      password: 'hash',
    });

    await customerRepository.save(
      new Customer('customer-2', 'user-2', '0987654321'),
    );

    const found = await customerRepository.findById('customer-2');
    expect(found).toBeInstanceOf(Customer);
    expect(found?.id).toBe('customer-2');
    expect(found?.userId).toBe('user-2');
    expect(found?.phone).toBe('0987654321');
  });

  it('should return null when id is not found', async () => {
    const found = await customerRepository.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('should return a customer when email is found', async () => {
    await userRepository.save({
      id: 'user-3',
      name: 'Carol',
      email: 'carol@test.com',
      password: 'hash',
    });

    const savedCustomer = await customerRepository.save(
      new Customer('customer-3', 'user-3', '0987654321'),
    );

    const found = await customerRepository.findByEmail('carol@test.com');
    expect(found?.id).toBe(savedCustomer?.id);
    expect(found?.userId).toBe(savedCustomer?.userId);
    expect(found?.phone).toBe(savedCustomer?.phone);
  });

  it('should return null when email is not found', async () => {
    const found = await customerRepository.findByEmail('missing@test.com');
    expect(found).toBeNull();
  });
});
