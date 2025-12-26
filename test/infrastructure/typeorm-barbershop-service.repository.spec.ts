import { BarbershopService } from 'src/modules/barbershop-service/domain/model/barbershop-service.model';
import { BarbershopServiceEntity } from 'src/modules/barbershop-service/infrastructure/entity/barbershop-service.entity';
import { TypeORMBarbershopServiceRepository } from 'src/modules/barbershop-service/infrastructure/repositories/typeorm-barbershop-service.repository';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';
import { BarbershopEntity } from 'src/modules/barbershop/infrastructure/entity/barbershop.entity';
import { BookingEntity } from 'src/modules/booking/infrastructure/entity/booking.entity';
import { CustomerEntity } from 'src/modules/customer/infrastructure/entity/customer.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entity/user.entity';
import { DataSource, Repository } from 'typeorm';

describe('TypeORMBarbershopServiceRepository', () => {
  let dataSource: DataSource;
  let barbershopServiceRepository: TypeORMBarbershopServiceRepository;
  let userRepository: Repository<UserEntity>;
  let barbershopRepository: Repository<BarbershopEntity>;

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

    barbershopServiceRepository = new TypeORMBarbershopServiceRepository(
      dataSource.getRepository(BarbershopServiceEntity),
    );

    userRepository = dataSource.getRepository(UserEntity);
    barbershopRepository = dataSource.getRepository(BarbershopEntity);
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

  it('should persist a barbershop serviceand return domain', async () => {
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

    const barbershopService = new BarbershopService(
      'service-1',
      savedBarbershop.id,
      'Haircut',
      30,
      25.0,
    );

    const savedService =
      await barbershopServiceRepository.save(barbershopService);

    expect(savedService).toBeInstanceOf(BarbershopService);
    expect(savedService?.id).toBe('service-1');
    expect(savedService?.barbershopId).toBe('shop-1');
    expect(savedService?.name).toBe('Haircut');
    expect(savedService?.durationMinutes).toBe(30);
    expect(savedService?.price).toBe(25.0);
  });

  it('should return a barbershop service when id is found', async () => {
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
      'Barber Shop 2',
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

    const barbershopService = new BarbershopService(
      'service-1',
      savedBarbershop.id,
      'Haircut',
      30,
      25.0,
    );

    await barbershopServiceRepository.save(barbershopService);

    const foundService =
      await barbershopServiceRepository.findById('service-1');
    expect(foundService).toBeInstanceOf(BarbershopService);
    expect(foundService?.id).toBe('service-1');
    expect(foundService?.barbershopId).toBe('shop-2');
    expect(foundService?.name).toBe('Haircut');
    expect(foundService?.durationMinutes).toBe(30);
    expect(foundService?.price).toBe(25.0);
  });

  it('should return null when barbershop service id is not found', async () => {
    const foundService =
      await barbershopServiceRepository.findById('non-existent-id');
    expect(foundService).toBeNull();
  });

  it('should return all services for a given barbershop id', async () => {
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
      'Barber Shop 3',
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
    const service1 = new BarbershopService(
      'service-1',
      savedBarbershop.id,
      'Haircut',
      30,
      25.0,
    );
    const service2 = new BarbershopService(
      'service-2',
      savedBarbershop.id,
      'Shave',
      15,
      15.0,
    );
    await barbershopServiceRepository.save(service1);
    await barbershopServiceRepository.save(service2);
    const services =
      await barbershopServiceRepository.findByBarbershopId('shop-3');
    expect(services).toHaveLength(2);
    const serviceIds = services.map((s) => s.id);
    expect(serviceIds).toContain('service-1');
    expect(serviceIds).toContain('service-2');
  });
});
