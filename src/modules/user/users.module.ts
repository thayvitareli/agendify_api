import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
})
export class UserModule {}
