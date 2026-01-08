import { Body, Controller, Post } from '@nestjs/common';
import { SignInUseCase } from '../../use-cases/sign-in.use-case';
import { SignInDto } from '../dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.signInUseCase.execute(body.email, body.password);
  }
}
