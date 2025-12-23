import { UnauthorizedException } from '@nestjs/common';
import { IPasswordHasher } from '../domain/ports/password-hasher.port';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IJwtAdapter } from '../domain/ports/jwt.port';

export class SignInUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashService: IPasswordHasher,
    private readonly jwtService: IJwtAdapter,
  ) {}

  async execute(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.paswword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
