import { v4 as uuid } from 'uuid';
import type { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import type { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import User from '../../user/domain/model/user.model';
import type { IBarbershopRepository } from '../domain/repositories/barbershop.repository';
import { Barbershop } from '../domain/model/barbershop.model';
import CreateBarbershopDto from '../presentation/dto/create-barbershop.dto';
import { Inject } from '@nestjs/common';

export class RegisterBarbershopUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IBarbershopRepository')
    private readonly barbershopRepo: IBarbershopRepository,
    @Inject('IPasswordHasher')
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(input: CreateBarbershopDto) {
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
