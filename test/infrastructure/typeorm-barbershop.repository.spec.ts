import { before } from 'node:test';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { TypeORMBarbershopRepository } from 'src/modules/barbershop/infrastructure/repositories/typeorm-barbershop.repository';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

describe('TypeORMBarbershopRepository', () => {
  let dataSource: DataSource;
  let barbershopRepository: TypeORMBarbershopRepository;
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

    barbershopRepository = new TypeORMBarbershopRepository(
      dataSource.getRepository(BarbershopEntity),
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

  it('should persist a barbershop and return domain', async () => {
    await userRepository.save({
      id: 'user-1',
      name: 'Charlie',
      email: 'charlie@teste.com',
      password: 'hash',
    });

    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');
    const barbershop = new Barbershop(
      'shop-1',
      'user-1',
      '5555-1234',
      'Barber Shop',
      address,
    );

    const savedBarbershop = await barbershopRepository.save(barbershop);

    expect(savedBarbershop).toBeInstanceOf(Barbershop);
    expect(savedBarbershop?.id).toBe('shop-1');
    expect(savedBarbershop?.ownerUserId).toBe('user-1');
    expect(savedBarbershop?.name).toBe('Barber Shop');
    expect(savedBarbershop?.phone).toBe('5555-1234');
    expect(savedBarbershop?.address.street).toBe('Main St');
    expect(savedBarbershop?.address.number).toBe('123');
    expect(savedBarbershop?.address.city).toBe('Metropolis');
    expect(savedBarbershop?.address.state).toBe('NY');
    expect(savedBarbershop?.address.zipCode).toBe('12345');
  });

  it('should return a barbershop when id is found', async () => {
    await userRepository.save({
      id: 'user-2',
      name: 'Bob',
      email: 'bob@teste.com',
      password: 'hash',
    });

    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');

    const barbershop = new Barbershop(
      'shop-2',
      'user-2',
      '5555-1234',
      'Barber Shop',
      address,
    );

    await barbershopRepository.save(barbershop);

    const foundBarbershop = await barbershopRepository.findById('shop-2');

    expect(foundBarbershop).toBeInstanceOf(Barbershop);
    expect(foundBarbershop?.id).toBe('shop-2');
    expect(foundBarbershop?.ownerUserId).toBe('user-2');
    expect(foundBarbershop?.name).toBe('Barber Shop');
    expect(foundBarbershop?.phone).toBe('5555-1234');
    expect(foundBarbershop?.address.street).toBe('Main St');
    expect(foundBarbershop?.address.number).toBe('123');
    expect(foundBarbershop?.address.city).toBe('Metropolis');
    expect(foundBarbershop?.address.state).toBe('NY');
    expect(foundBarbershop?.address.zipCode).toBe('12345');
  });

  it('should return null when id is not found', async () => {
    const foundBarbershop =
      await barbershopRepository.findById('non-existent-id');
    expect(foundBarbershop).toBeNull();
  });

  it('should return a barbershop when email is found', async () => {
    await userRepository.save({
      id: 'user-3',
      name: 'Alice',
      email: 'alice@test.com',
      password: 'hash',
    });

    const address = new Address('Main St', '123', 'Metropolis', 'NY', '12345');
    const barbershop = new Barbershop(
      'shop-3',
      'user-3',
      '5555-1234',
      'Alice Barber Shop',
      address,
    );
    await barbershopRepository.save(barbershop);

    const foundBarbershop =
      await barbershopRepository.findByEmail('alice@test.com');
    expect(foundBarbershop).toBeInstanceOf(Barbershop);
    expect(foundBarbershop?.id).toBe('shop-3');
    expect(foundBarbershop?.ownerUserId).toBe('user-3');
    expect(foundBarbershop?.name).toBe('Alice Barber Shop');
    expect(foundBarbershop?.phone).toBe('5555-1234');
    expect(foundBarbershop?.address.street).toBe('Main St');
    expect(foundBarbershop?.address.number).toBe('123');
    expect(foundBarbershop?.address.city).toBe('Metropolis');
    expect(foundBarbershop?.address.state).toBe('NY');
    expect(foundBarbershop?.address.zipCode).toBe('12345');
  });

  it('should return null when email is not found', async () => {
    const foundBarbershop = await barbershopRepository.findByEmail(
      'non-existent@test.com',
    );
    expect(foundBarbershop).toBeNull();
  });
});
