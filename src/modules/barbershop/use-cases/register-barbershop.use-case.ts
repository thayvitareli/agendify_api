import { v4 as uuid } from 'uuid';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import User from '../../user/domain/model/user.model';
import { IBarbershopRepository } from '../domain/repositories/barbershop.repository';
import { Barbershop } from '../domain/model/barbershop.model';
import { Address } from '../domain/value_objects/address.vo';

export class RegisterBarbershopUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly barbershopRepo: IBarbershopRepository,
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: Address;
  }) {
    User.validateEmail(input.email);
    Barbershop.validatePhone(input.phone);

    const existing = await this.userRepo.findByEmail(input.email);

    if (existing) {
      throw new Error('Email already in use');
    }

    const hash = await this.hasher.hash(input.password);

    const user = new User(uuid(), input.name, input.email, hash);

    await this.userRepo.save(user);

    const barbershop = new Barbershop(
      uuid(),
      user.id,
      input.phone,
      input.name,
      input.address,
    );

    await this.barbershopRepo.save(barbershop);

    return { user, barbershop };
  }
}
