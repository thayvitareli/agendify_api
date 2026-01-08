import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controller/auth.controller';
import { BcryptPasswordHasherAdapter } from './infrasctructure/bcrypt-password-hasher.adapter';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from './infrasctructure/jwt.adapter';
import { SignInUseCase } from './use-cases/sign-in.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/infrastructure/entity/user.entity';
import { TypeORMUserRepository } from '../user/infrastructure/repositories/type-orm-user.repository';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasherAdapter,
    },
    {
      provide: 'IUserRepository',
      useClass: TypeORMUserRepository,
    },
    {
      provide: 'IJwtAdapter',
      useClass: JwtAdapter,
    },
    SignInUseCase,
    JwtAuthGuard,
  ],
  exports: ['IPasswordHasher', 'IJwtAdapter', JwtAuthGuard, JwtModule],
})
export class AuthModule {}
