import { JwtService } from '@nestjs/jwt';
import type { IJwtAdapter } from '../domain/ports/jwt.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAdapter implements IJwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
  async sign(payload: object): Promise<string> {
    return await this.jwtService.sign({ ...payload });
  }

  async verify<TPayload extends object = any>(token: string): Promise<TPayload> {
    return (await this.jwtService.verifyAsync(token)) as TPayload;
  }
}
