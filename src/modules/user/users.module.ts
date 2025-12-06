import { Module } from '@nestjs/common';
import CreateUserUseCase from './use-cases/create-user.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
