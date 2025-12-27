import User from 'src/modules/user/domain/model/user.model';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import { v4 as uuid } from 'uuid';
import { ICustomerRepository } from 'src/modules/customer/domain/repositories/customer.repository';
import { RegisterCustomerUseCase } from 'src/modules/customer/use-cases/register-customer.use-case';
import { Customer } from 'src/modules/customer/domain/model/customer.model';

jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('RegisterCustomerUseCase', () => {
  const userRepo: jest.Mocked<IUserRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const customerRepo: jest.Mocked<ICustomerRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const hasher: jest.Mocked<IPasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockedUuid = uuid as jest.MockedFunction<typeof uuid>;

  beforeEach(() => {
    jest.clearAllMocks();
    hasher.hash.mockResolvedValue('hashed-password');
    userRepo.save.mockResolvedValue({} as User);
    userRepo.findByEmail.mockResolvedValue(null);
    customerRepo.save.mockResolvedValue(null);
    mockedUuid.mockReset();
    mockedUuid
      //@ts-ignore
      .mockReturnValueOnce('user-id')
      //@ts-ignore
      .mockReturnValueOnce('customer-id');
  });

  it('Should save a new Customer', async () => {
    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'plain-pass',
      phone: '999999999',
    };

    const result = await useCase.execute(input);

    expect(hasher.hash).toHaveBeenCalledWith('plain-pass');

    expect(userRepo.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepo.save.mock.calls[0][0];
    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.id).toBe('user-id');
    expect(savedUser.name).toBe('Jane Doe');
    expect(savedUser.email).toBe('jane@example.com');

    expect(customerRepo.save).toHaveBeenCalledTimes(1);
    const savedCustomer = customerRepo.save.mock.calls[0][0];
    expect(savedCustomer).toBeInstanceOf(Customer);
    expect(savedCustomer.id).toBe('customer-id');
    expect(savedCustomer.userId).toBe('user-id');
    expect(savedCustomer.phone).toBe('999999999');

    expect(result.user).toBe(savedUser);
    expect(result.customer).toBe(savedCustomer);
  });

  it('Should throw error when the email is already registered', async () => {
    const existingUser = new User(
      'existing-id',
      'Existing',
      'jane@example.com',
      'hash',
    );
    userRepo.findByEmail.mockResolvedValue(existingUser);

    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'plain-pass',
      phone: '999999999',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Email already in use',
    );

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it("should throw hasher error and don't save anything", async () => {
    hasher.hash.mockRejectedValueOnce(new Error('hash error'));

    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'jane2@example.com',
      password: 'plain-pass',
      phone: '999999999',
    };

    await expect(useCase.execute(input)).rejects.toThrow('hash error');

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('Should throw an error when user save fails', async () => {
    userRepo.save.mockRejectedValueOnce(new Error('db error'));
    userRepo.findByEmail.mockResolvedValueOnce(null);

    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'jane3@example.com',
      password: 'plain-pass',
      phone: '999999999',
    };

    await expect(useCase.execute(input)).rejects.toThrow('db error');

    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('Should throw an error when the email is invalid', async () => {
    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'invalid-email',
      password: 'plain-pass',
      phone: '999999999',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid email');

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepo.save).not.toHaveBeenCalled();
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('Should throw an error when the phone is invalid', async () => {
    const useCase = new RegisterCustomerUseCase(userRepo, customerRepo, hasher);

    const input = {
      name: 'Jane Doe',
      email: 'jane4@example.com',
      password: 'plain-pass',
      phone: 'abc',
    };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid phone');

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(customerRepo.save).not.toHaveBeenCalled();
  });
});
