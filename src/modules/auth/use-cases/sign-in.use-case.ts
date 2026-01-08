import { UnauthorizedException } from '@nestjs/common';
import type { IPasswordHasher } from '../domain/ports/password-hasher.port';
import type { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import type { IJwtAdapter } from '../domain/ports/jwt.port';
import { Inject } from '@nestjs/common';

export class SignInUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly hashService: IPasswordHasher,
    @Inject('IJwtAdapter')
    private readonly jwtService: IJwtAdapter,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
