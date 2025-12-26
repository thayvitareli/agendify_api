import User from 'src/modules/user/domain/model/user.model';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { TypeORMUserRepository } from 'src/modules/user/infrastructure/repositories/type-orm-user.repository';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { DataSource } from 'typeorm';

describe('TypeORMUserRepository', () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;

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

    userRepository = new TypeORMUserRepository(
      dataSource.getRepository(UserEntity),
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

  it('save should persist a user and return domain', async () => {
    const user = new User('user-1', 'Alice', 'alice@test.com', 'hash');

    const savedUser = await userRepository.save(user);

    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.id).toBe('user-1');
    expect(savedUser.name).toBe('Alice');
    expect(savedUser.email).toBe('alice@test.com');

    const persisted = await dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: 'user-1' } });
    expect(persisted?.id).toBe('user-1');
    expect(persisted?.email).toBe('alice@test.com');
  });

  it('findById should return a user when found', async () => {
    await userRepository.save(
      new User('user-2', 'Bob', 'bob@test.com', 'hash'),
    );

    const found = await userRepository.findById('user-2');

    expect(found).toBeInstanceOf(User);
    expect(found?.id).toBe('user-2');
    expect(found?.name).toBe('Bob');
    expect(found?.email).toBe('bob@test.com');
  });

  it('findById should return null when not found', async () => {
    const found = await userRepository.findById('non-existent-id');
    expect(found).toBeNull();
  });

  it('findByEmail should return a user when found', async () => {
    const savedUser = await userRepository.save(
      new User('user-3', 'Carol', 'carol@test.com', 'hash'),
    );

    const found = await userRepository.findByEmail('carol@test.com');

    expect(found?.id).toBe(savedUser.id);
    expect(found?.name).toBe(savedUser.name);
    expect(found?.email).toBe(savedUser.email);
  });

  it('findByEmail should return null when not found', async () => {
    const found = await userRepository.findByEmail('missing@test.com');
    expect(found).toBeNull();
  });
});
