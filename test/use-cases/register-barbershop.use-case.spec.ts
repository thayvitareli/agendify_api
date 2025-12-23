import User from 'src/modules/user/domain/model/user.model';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import { v4 as uuid } from 'uuid';
import { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';
import { RegisterBarbershopUseCase } from 'src/modules/barbershop/use-cases/register-barbershop.use-case';
import { Barbershop } from 'src/modules/barbershop/domain/model/barbershop.model';
import { Address } from 'src/modules/barbershop/domain/value_objects/address.vo';

jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('RegisterBarbershopUseCase', () => {
  const userRepo: jest.Mocked<IUserRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const barbershopRepo: jest.Mocked<IBarbershopRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const hasher: jest.Mocked<IPasswordHasher> = {
    hash: jest.fn(),
  };

  const mockedUuid = uuid as jest.MockedFunction<typeof uuid>;

  beforeEach(() => {
    jest.clearAllMocks();
    hasher.hash.mockResolvedValue('hashed-password');
    userRepo.save.mockResolvedValue();
    userRepo.findByEmail.mockResolvedValue(null);
    barbershopRepo.save.mockResolvedValue();
    mockedUuid.mockReset();
    mockedUuid
      //@ts-ignore
      .mockReturnValueOnce('user-id')
      //@ts-ignore
      .mockReturnValueOnce('barbershop-id');
  });

  it('should create and save User and Barbershop with generated ids and hashed password', async () => {
    const useCase = new RegisterBarbershopUseCase(
      userRepo,
      barbershopRepo,
      hasher,
    );

    const input = {
      name: 'Barber Shop',
      email: 'barber@example.com',
      password: 'plain-pass',
      phone: '999999999',
      address: new Address('Main St', '123', 'City', 'ST', '00000'),
    };

    const result = await useCase.execute(input);

    expect(hasher.hash).toHaveBeenCalledWith('plain-pass');

    expect(userRepo.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepo.save.mock.calls[0][0];
    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.id).toBe('user-id');
    expect(savedUser.name).toBe('Barber Shop');
    expect(savedUser.email).toBe('barber@example.com');

    expect(barbershopRepo.save).toHaveBeenCalledTimes(1);
    const savedBarbershop = barbershopRepo.save.mock.calls[0][0];
    expect(savedBarbershop).toBeInstanceOf(Barbershop);
    expect(savedBarbershop.id).toBe('barbershop-id');
    expect(savedBarbershop.ownerUserId).toBe('user-id');
    expect(savedBarbershop.phone).toBe('999999999');
    expect(savedBarbershop.name).toBe('Barber Shop');

    expect(result.user).toBe(savedUser);
    expect(result.barbershop).toBe(savedBarbershop);
  });

  it('should throw error when the email is already registered', async () => {
    const existingUser = new User(
      'existing-id',
      'Existing',
      'barber@example.com',
      'hash',
    );
    userRepo.findByEmail.mockResolvedValue(existingUser);

    const useCase = new RegisterBarbershopUseCase(
      userRepo,
      barbershopRepo,
      hasher,
    );

    const input = {
      name: 'Barber Shop',
      email: 'barber@example.com',
      password: 'plain-pass',
      phone: '999999999',
      address: new Address('Main St', '123', 'City', 'ST', '00000'),
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Email already in use',
    );

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(barbershopRepo.save).not.toHaveBeenCalled();
  });

  it('should propagate hasher error and not save anything', async () => {
    hasher.hash.mockRejectedValueOnce(new Error('hash error'));

    const useCase = new RegisterBarbershopUseCase(
      userRepo,
      barbershopRepo,
      hasher,
    );

    const input = {
      name: 'Barber Shop',
      email: 'barber2@example.com',
      password: 'plain-pass',
      phone: '999999999',
      address: new Address('Main St', '123', 'City', 'ST', '00000'),
    };

    await expect(useCase.execute(input)).rejects.toThrow('hash error');

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(barbershopRepo.save).not.toHaveBeenCalled();
  });

  it('should not save user when phone is invalid', async () => {
    const useCase = new RegisterBarbershopUseCase(
      userRepo,
      barbershopRepo,
      hasher,
    );

    const input = {
      name: 'Barber Shop',
      email: 'barber3@example.com',
      password: 'plain-pass',
      phone: 'abc',
      address: new Address('Main St', '123', 'City', 'ST', '00000'),
    };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid phone');

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepo.save).not.toHaveBeenCalled();
    expect(barbershopRepo.save).not.toHaveBeenCalled();
  });
});
