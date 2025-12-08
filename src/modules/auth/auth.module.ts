import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BcryptPasswordHasherAdapter } from './infrasctructure/bcrypt-password-hasher.adapter';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'IPasswordHasher',
      useClass: BcryptPasswordHasherAdapter,
    },
  ],
  exports: ['IPasswordHasher'],
})
export class AuthModule {}
