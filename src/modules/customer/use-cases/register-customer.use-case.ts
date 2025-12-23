import { Customer } from '../domain/model/customer.model';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import { ICustomerRepository } from '../domain/repositories/customer.repository';
import User from '../../user/domain/model/user.model';

export class RegisterCustomerUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) {
    User.validateEmail(input.email);
    Customer.validatePhone(input.phone);

    const existing = await this.userRepo.findByEmail(input.email);

    if (existing) {
      throw new Error('Email already in use');
    }

    const hash = await this.hasher.hash(input.password);

    const user = new User(uuid(), input.name, input.email, hash);

    await this.userRepo.save(user);

    const customer = new Customer(uuid(), user.id, input.phone);

    await this.customerRepo.save(customer);

    return { user, customer };
  }
}
